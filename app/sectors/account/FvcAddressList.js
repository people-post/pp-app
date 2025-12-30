
class FvcAddressList extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fItems = new ui.FSimpleFragmentList();
    this.setChild('items', this._fItems);

    this._fBtnNew = new gui.ActionButton();
    this._fBtnNew.setIcon(gui.ActionButton.T_ICON.NEW);
    this._fBtnNew.setDelegate(this);
  }

  getActionButton() { return this._fBtnNew; }
  getDataForGuiAddress(fAddress, addressId) {
    return dba.Address.get(addressId);
  }
  onGuiActionButtonClick(fActionButton) {
    let v = new ui.View();
    v.setContentFragment(new acnt.FvcAddressEditor());
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
    case plt.T_DATA.USER_ADDRESS_IDS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let ids = dba.Account.getAddressIds();
    this._fItems.clear();
    for (let id of ids) {
      let f = new gui.Address();
      f.setDelegate(this);
      f.setDataSource(this);
      f.setAddressId(id);
      this._fItems.append(f);
    }
    this._fItems.attachRender(render);
    this._fItems.render();
  }

  #showAddressEditor(addressId) {
    let v = new ui.View();
    let f = new acnt.FvcAddressEditor();
    f.setAddressId(addressId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Edit address");
  }

  #asyncDeleteAddress(addressId) {
    let url = "/api/user/remove_address";
    let fd = new FormData();
    fd.append("id", addressId);
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onDeleteRRR(d));
  }

  #onDeleteRRR(data) { dba.Account.resetAddressIds(response.data.address_ids); }
};

acnt.FvcAddressList = FvcAddressList;
}(window.acnt = window.acnt || {}));
