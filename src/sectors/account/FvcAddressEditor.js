import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { AddressEditor } from '../../common/gui/AddressEditor.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Address as AddressDBA } from '../../common/dba/Address.js';
import { Account } from '../../common/dba/Account.js';
import { api } from '../../common/plt/Api.js';
import { Address as AddressDataType } from '../../common/datatypes/Address.js';

export class FvcAddressEditor extends FScrollViewContent {
  #fAddress;
  #btnSubmit;
  #addressId = null;

  constructor() {
    super();
    this.#fAddress = new AddressEditor();
    this.setChild("editor", this.#fAddress);

    this.#btnSubmit = new Button();
    this.#btnSubmit.setName("Submit");
    this.#btnSubmit.setDelegate(this);
    this.setChild("submit", this.#btnSubmit);
  }

  setAddressId(id) { this.#addressId = id; }

  onSimpleButtonClicked(fBtn) { this.#onSubmit(); }

  _renderContentOnRender(render) {
    let addr;
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

  #onSubmit() {
    if (this.#addressId) {
      this.#asyncUpdateAddress(this.#fAddress.getData());
    } else {
      this.#asyncAddAddress(this.#fAddress.getData());
    }
  }

  #fillFormData(formData, address) {
    formData.append("nickname", address.getNickname());
    formData.append("name", address.getName());
    formData.append("country", address.getCountry());
    formData.append("state", address.getState());
    formData.append("city", address.getCity());
    formData.append("zipcode", address.getZipcode());
    formData.append("lines", address.getLine(0));
    let line1 = address.getLine(1);
    if (line1 && line1.length) {
      formData.append("lines", line1);
    }
  }

  #asyncUpdateAddress(address) {
    let url = "/api/user/update_address";
    let fd = new FormData();
    fd.append("id", this.#addressId);
    this.#fillFormData(fd, address);
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onUpdateAddressRRR(d));
  }

  #asyncAddAddress(address) {
    let url = "/api/user/add_address";
    let fd = new FormData();
    this.#fillFormData(fd, address);
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onAddAddressRRR(d));
  }

  #onUpdateAddressRRR(data) {
    AddressDBA.update(new AddressDataType(data.address));
    this._owner.onContentFragmentRequestPopView(this);
  }

  #onAddAddressRRR(data) {
    Account.resetAddressIds(data.address_ids);
    this._owner.onContentFragmentRequestPopView(this);
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.acnt = window.acnt || {};
  window.acnt.FvcAddressEditor = FvcAddressEditor;
}
