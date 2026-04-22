import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { AddressEditor } from './AddressEditor.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Address as AddressDBA } from '../dba/Address.js';
import { Address as AddressDataType } from '../datatypes/Address.js';
import { Api } from '../plt/Api.js';
import type { Address } from '../datatypes/Address.js';
import { Account } from '../dba/Account.js';
import { AddressData } from '../../types/backend2.js';

interface ApiUpdateAddressResponse {
  address: AddressData;
}

interface ApiAddAddressResponse {
  address_ids: string[];
}

export class FvcAddressEditor extends FScrollViewContent {
  #fAddress: AddressEditor;
  #btnSubmit: Button;
  #addressId: string | null = null;

  constructor() {
    super();
    this.#fAddress = new AddressEditor();
    this.setChild('editor', this.#fAddress);

    this.#btnSubmit = new Button();
    this.#btnSubmit.setName('Submit');
    this.#btnSubmit.setDelegate(this);
    this.setChild('submit', this.#btnSubmit);
  }

  setAddressId(id: string | null): void { this.#addressId = id; }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onSubmit(); }

  _renderContentOnRender(render: PanelWrapper): void {
    let addr: Address | null = null;
    if (this.#addressId) {
      addr = AddressDBA.get(this.#addressId);
      if (!addr) {
        return;
      }
    }

    let panel = new ListPanel();
    render.wrapPanel(panel);

    let p = new PanelWrapper();
    panel.pushPanel(p);
    this.#fAddress.attachRender(p);
    this.#fAddress.render();
    if (addr) {
      this.#fAddress.setData(addr);
    }

    panel.pushSpace(1);

    p = new PanelWrapper();
    panel.pushPanel(p);
    this.#btnSubmit.attachRender(p);
    this.#btnSubmit.render();
  }

  #onSubmit(): void {
    if (this.#addressId) {
      this.#asyncUpdateAddress(this.#fAddress.getData());
    } else {
      this.#asyncAddAddress(this.#fAddress.getData());
    }
  }

  #fillFormData(formData: FormData, address: Address): void {
    formData.append('nickname', address.getNickname() ?? '');
    formData.append('name', address.getName() ?? '');
    formData.append('country', address.getCountry() ?? '');
    formData.append('state', address.getState() ?? '');
    formData.append('city', address.getCity() ?? '');
    formData.append('zipcode', address.getZipcode() ?? '');
    formData.append('lines', address.getLine(0) ?? '');
    let line1 = address.getLine(1);
    if (line1 && line1.length) {
      formData.append('lines', line1);
    }
  }

  #asyncUpdateAddress(address: Address): void {
    let url = '/api/user/update_address';
    let fd = new FormData();
    fd.append('id', this.#addressId!);
    this.#fillFormData(fd, address);
    Api.asFragmentPost<ApiUpdateAddressResponse>(this, url, fd)
        .then((d: ApiUpdateAddressResponse) => this.#onUpdateAddressRRR(d));
  }

  #asyncAddAddress(address: Address): void {
    let url = '/api/user/add_address';
    let fd = new FormData();
    this.#fillFormData(fd, address);
    Api.asFragmentPost<ApiAddAddressResponse>(this, url, fd)
        .then((d: ApiAddAddressResponse) => this.#onAddAddressRRR(d));
  }

  #onUpdateAddressRRR(data: ApiUpdateAddressResponse): void {
    AddressDBA.update(new AddressDataType(data.address));
    this._requestPopView();
  }

  #onAddAddressRRR(data: ApiAddAddressResponse): void {
    Account.resetAddressIds(data.address_ids);
    this._requestPopView();
  }
}
