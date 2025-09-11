(function(shop) {
class FBtnViewQueue extends ui.Fragment {
  constructor() {
    super();
    this._fBtn = new ui.Button();
    this._fBtn.setName("View queue&#x1f517;");
    this._fBtn.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this._fBtn.setDelegate(this);
    this.setChild("btn", this._fBtn);

    this._branchId = null;
  }

  onSimpleButtonClicked(fBtn) { this.#onViewQueue(); }

  setBranchId(id) { this._branchId = id; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.SHOP_BRANCH:
    case plt.T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let u = this.#getSupplier();
    this._fBtn.setEnabled(!!u);
    this._fBtn.attachRender(render);
    this._fBtn.render();
  }

  #onViewQueue() {
    let u = this.#getSupplier();
    if (u) {
      let url;
      if (dba.Account.getId() == u.getId()) {
        url = u.getCounterUrl(this._branchId);
      } else {
        url = u.getQueueUrl(this._branchId);
      }
      window.open(url, '_blank').focus();
    }
  }

  #getSupplier() {
    let b = dba.Shop.getBranch(this._branchId);
    if (b) {
      return dba.Users.get(b.getOwnerId());
    }
    return null;
  }
};

shop.FBtnViewQueue = FBtnViewQueue;
}(window.shop = window.shop || {}));
