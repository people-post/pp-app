(function(shop) {
class FvcBranchSelection extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fBranches = new shop.FBranchList();
    this._fBranches.setDelegate(this);
    this.setChild("branches", this._fBranches);
  }

  onBranchListFragmentRequestShowView(fBranchList, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }

  onBranchSelectedInBranchListFragment(fBranchList, branchId) {
    this._delegate.onBranchSelectedInBranchSelectionContentFragment(this,
                                                                    branchId);
  }

  _renderContentOnRender(render) {
    this._fBranches.attachRender(render);
    this._fBranches.render();
  }
};

shop.FvcBranchSelection = FvcBranchSelection;
}(window.shop = window.shop || {}));
