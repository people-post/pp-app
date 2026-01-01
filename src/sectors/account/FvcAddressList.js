import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { Address } from '../../common/gui/Address.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcAddressEditor } from './FvcAddressEditor.js';
import { Address as AddressDBA } from '../../common/dba/Address.js';
import { Account } from '../../common/dba/Account.js';
import { T_DATA } from '../../common/plt/Events.js';
import { api } from '../../common/plt/Api.js';
import { R } from '../../common/constants/R.js';

export class FvcAddressList extends FScrollViewContent {
  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this.setChild('items', this._fItems);

    this._fBtnNew = new ActionButton();
    this._fBtnNew.setIcon(ActionButton.T_ICON.NEW);
    this._fBtnNew.setDelegate(this);
  }

  getActionButton() { return this._fBtnNew; }
  getDataForGuiAddress(fAddress, addressId) {
    return AddressDBA.get(addressId);
  }
  onGuiActionButtonClick(fActionButton) {
    let v = new View();
    v.setContentFragment(new FvcAddressEditor());
    this._owner.onFragmentRequestShowView(this, v, "New Address")
  }

  onClickInAddressFragment(fAddress, addressId) {
    this.#showAddressEditor(addressId);
  }

  onAddressFragmentRequestEdit(fAddress, addressId) {
    this.#showAddressEditor(addressId);
  }

  onAddressFragmentRequestDelete(fAddress, addressId) {
    this._confirmDangerousOperation(R.get("CONFIRM_DELETE_ADDRESS"),
                                    () => this.#asyncDeleteAddress(addressId));
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.USER_ADDRESS_IDS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
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

  #showAddressEditor(addressId) {
    let v = new View();
    let f = new FvcAddressEditor();
    f.setAddressId(addressId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Edit address");
  }

  #asyncDeleteAddress(addressId) {
    let url = "/api/user/remove_address";
    let fd = new FormData();
    fd.append("id", addressId);
    api.asyncFragmentPost(this, url, fd).then(d => this.#onDeleteRRR(d));
  }

  #onDeleteRRR(data) { Account.resetAddressIds(data.address_ids);   }
}
