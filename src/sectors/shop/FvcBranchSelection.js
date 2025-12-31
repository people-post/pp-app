import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcBranchSelection extends FScrollViewContent {
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcBranchSelection = FvcBranchSelection;
}
