import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FBranchList } from './FBranchList.js';

export class FvcBranchSelection extends FScrollViewContent {
  constructor() {
    super();
    this._fBranches = new FBranchList();
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
