
class FBranchList extends ui.Fragment {
  #fItems;
  #btnAdd;
  #ids = null;
  #selectedId = null;
  #isEditEnabled = false;
  #isBranchIdsLoading = false;

  constructor() {
    super();
    this.#fItems = new ui.FSimpleFragmentList();
    this.setChild("items", this.#fItems);

    this.#btnAdd = new ui.Button();
    this.#btnAdd.setName("+New branch");
    this.#btnAdd.setDelegate(this);
    this.setChild("btnAdd", this.#btnAdd);
  }

  setEnableEdit(b) { this.#isEditEnabled = b; }

  isBranchSelectedInBranchFragment(fBranch, branchId) {
    return this.#selectedId == branchId;
  }

  onSimpleButtonClicked(fBtn) { this.#asyncAdd(); }
  onBranchFragmentRequestShowView(fBranch, view, title) {
    this._delegate.onBranchListFragmentRequestShowView(this, view, title);
  }
  onClickInBranchFragment(fBranch, branchId) {
    this.#selectedId = branchId;
    this.render();
    this._delegate.onBranchSelectedInBranchListFragment(this, branchId);
  }

  _renderOnRender(render) {
    if (!this.#ids) {
      this.#asyncGetBrancheIds();
      return;
    }

    let pMain = new ui.ListPanel();
    render.wrapPanel(pMain);
    let p = new ui.PanelWrapper();
    pMain.pushPanel(p);

    this.#fItems.clear();
    for (let id of this.#ids) {
      let f = new shop.FBranch();
      f.setLayoutType(shop.FBranch.T_LAYOUT.SMALL);
      f.setBranchId(id);
      f.setEnableEdit(this.#isEditEnabled);
      f.setDataSource(this);
      f.setDelegate(this);
      this.#fItems.append(f);
    }
    this.#fItems.attachRender(p);
    this.#fItems.render();

    pMain.pushSpace(1);

    if (this.#isEditEnabled) {
      p = new ui.PanelWrapper();
      pMain.pushPanel(p);
      this.#btnAdd.attachRender(p);
      this.#btnAdd.render();
    }
  }

  #asyncGetBrancheIds() {
    if (this.#isBranchIdsLoading) {
      return;
    }
    this.#isBranchIdsLoading = true;
    let url = "api/shop/branch_ids";
    plt.Api.asyncFragmentCall(this, url).then(d => this.#onBranchIdsRRR(d));
  }

  #onBranchIdsRRR(data) {
    this.#isBranchIdsLoading = false;
    this.#ids = data.ids;
    this.render();
  }

  #asyncAdd() {
    let url = "api/shop/add_branch";
    let fd = new FormData();
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onAddBranchRRR(d));
  }

  #onAddBranchRRR(data) {
    if (this.#ids) {
      let b = new dat.ShopBranch(data.branch);
      this.#ids.push(b.getId());
    }
    this.render();
  }
};

shop.FBranchList = FBranchList;
}(window.shop = window.shop || {}));
