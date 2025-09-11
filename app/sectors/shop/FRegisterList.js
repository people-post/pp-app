(function(shop) {
class FRegisterList extends ui.Fragment {
  constructor() {
    super();
    this._fItems = new ui.FSimpleFragmentList();
    this.setChild("items", this._fItems);

    this._fBtnAdd = new ui.Button();
    this._fBtnAdd.setName("+New register");
    this._fBtnAdd.setDelegate(this);
    this.setChild("btnAdd", this._fBtnAdd);

    this._branchId = null;
    this._ids = null;
    this._selectedId = null;
    this._isEditEnabled = false;
  }

  setBranchId(id) { this._branchId = id; }
  setEnableEdit(b) { this._isEditEnabled = b; }

  isRegisterSelectedInRegisterFragment(fRegister, registerId) {
    return this._selectedId == registerId;
  }

  onSimpleButtonClicked(fBtn) { this.#asyncAdd(); }
  onRegisterFragmentRequestShowView(fRegister, view, title) {
    this._delegate.onRegisterListFragmentRequestShowView(this, view, title);
  }
  onClickInRegisterFragment(fRegister, registerId) {
    this._selectedId = registerId;
    this.render();
    this._delegate.onRegisterSelectedInRegisterListFragment(this, registerId);
  }

  _renderOnRender(render) {
    if (!this._ids) {
      this.#asyncGetRegisterIds();
      return;
    }

    let pMain = new ui.ListPanel();
    render.wrapPanel(pMain);
    let p = new ui.PanelWrapper();
    pMain.pushPanel(p);

    this._fItems.clear();
    for (let id of this._ids) {
      let f = new shop.FRegister();
      f.setLayoutType(shop.FRegister.T_LAYOUT.SMALL);
      f.setRegisterId(id);
      f.setEnableEdit(this._isEditEnabled);
      f.setDataSource(this);
      f.setDelegate(this);
      this._fItems.append(f);
    }
    this._fItems.attachRender(p);
    this._fItems.render();

    pMain.pushSpace(1);

    if (this._isEditEnabled) {
      p = new ui.PanelWrapper();
      pMain.pushPanel(p);
      this._fBtnAdd.attachRender(p);
      this._fBtnAdd.render();
    }
  }

  #asyncGetRegisterIds() {
    let url = "api/shop/register_ids";
    let fd = new FormData();
    fd.append("branch_id", this._branchId);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onRegisterIdsRRR(d));
  }

  #onRegisterIdsRRR(data) {
    this._ids = data.ids;
    this.render();
  }

  #asyncAdd() {
    let url = "api/shop/add_register";
    let fd = new FormData();
    fd.append("branch_id", this._branchId);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onAddRegisterRRR(d));
  }

  #onAddRegisterRRR(data) {
    if (this._ids) {
      let r = new dat.ShopRegister(data.register);
      this._ids.push(r.getId());
    }
    this.render();
  }
};

shop.FRegisterList = FRegisterList;
}(window.shop = window.shop || {}));
