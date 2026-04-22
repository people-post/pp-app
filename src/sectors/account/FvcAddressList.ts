import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { Address, AddressDataSource, AddressDelegate } from '../../common/gui/Address.js';
import { FvcAddressEditor } from '../../common/gui/FvcAddressEditor.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Address as AddressDBA } from '../../common/dba/Address.js';
import { T_DATA } from '../../common/plt/Events.js';
import { R } from '../../common/constants/R.js';
import { Api } from '../../common/plt/Api.js';
import type { Address as AddressType } from '../../common/datatypes/Address.js';
import { Account } from '../../common/dba/Account.js';

interface ApiRemoveAddressResponse {
  address_ids: string[];
}

export class FvcAddressList extends FScrollViewContent implements AddressDataSource, AddressDelegate {
  private _fItems: FSimpleFragmentList;
  private _fBtnNew: ActionButton;

  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this.setChild('items', this._fItems);

    this._fBtnNew = new ActionButton();
    this._fBtnNew.setIcon(ActionButton.T_ICON.NEW);
    this._fBtnNew.setDelegate(this);
  }

  getActionButton(): ActionButton { return this._fBtnNew; }
  getDataForGuiAddress(_fAddress: Address, addressId: string): AddressType | null {
    return AddressDBA.get(addressId);
  }
  onGuiActionButtonClick(_fActionButton: ActionButton): void {
    let v = new View();
    v.setContentFragment(new FvcAddressEditor());
    this.onFragmentRequestShowView(this, v, "New Address");
  }

  onClickInAddressFragment(_fAddress: Address, addressId: string): void {
    this.#showAddressEditor(addressId);
  }

  onAddressFragmentRequestEdit(_fAddress: Address, addressId: string): void {
    this.#showAddressEditor(addressId);
  }

  onAddressFragmentRequestDelete(_fAddress: Address, addressId: string): void {
    this._confirmDangerousOperation(R.get("CONFIRM_DELETE_ADDRESS"),
                                    () => this.#asyncDeleteAddress(addressId));
  }

  handleSessionDataUpdate(dataType: symbol, _data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_ADDRESS_IDS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, _data);
  }

  _renderContentOnRender(render: Panel): void {
    let ids = Account.getAddressIds();
    this._fItems.clear();
    for (let id of ids) {
      let f = new Address();
      f.setDelegate(this);
      f.setDataSource(this);
      f.setAddressId(id);
      this._fItems.append(f);
    }
    this._fItems.attachRender(render);
    this._fItems.render();
  }

  #showAddressEditor(addressId: string): void {
    let v = new View();
    let f = new FvcAddressEditor();
    f.setAddressId(addressId);
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Edit address");
  }

  #asyncDeleteAddress(addressId: string): void {
    let url = "/api/user/remove_address";
    let fd = new FormData();
    fd.append("id", addressId);
    Api.asFragmentPost<ApiRemoveAddressResponse>(this, url, fd).then((d: ApiRemoveAddressResponse) => this.#onDeleteRRR(d));
  }

  #onDeleteRRR(data: ApiRemoveAddressResponse): void { Account.resetAddressIds(data.address_ids); }
}
