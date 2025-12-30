
class FvcBranch extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fBranch = new shop.FBranch();
    this._fBranch.setDelegate(this);
    this.setChild("branch", this._fBranch);
  }

  setBranchId(id) { this._fBranch.setBranchId(id); }
  setEnableEdit(b) { this._fBranch.setEnableEdit(b); }

  onBranchFragmentRequestShowView(fBranch, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }
  onClickInBranchFragment(fBranch, branchId) {}

  _renderContentOnRender(render) {
    this._fBranch.attachRender(render);
    this._fBranch.render();
  }
};

shop.FvcBranch = FvcBranch;
}(window.shop = window.shop || {}));
