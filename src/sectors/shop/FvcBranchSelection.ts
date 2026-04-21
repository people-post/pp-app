import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FBranchList } from './FBranchList.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export interface FvcBranchSelectionDelegate {
  onBranchSelectedInBranchSelectionContentFragment(f: FvcBranchSelection, branchId: string): void;
}

export class FvcBranchSelection extends FScrollViewContent {
  private _fBranches: FBranchList;

  constructor() {
    super();
    this._fBranches = new FBranchList();
    this._fBranches.setDelegate(this);
    this.setChild("branches", this._fBranches);
  }

  onBranchListFragmentRequestShowView(_fBranchList: FBranchList, view: View, title: string): void {
    this.onFragmentRequestShowView(this, view, title);
  }

  onBranchSelectedInBranchListFragment(_fBranchList: FBranchList, branchId: string): void {
    this.getDelegate<FvcBranchSelectionDelegate>()?.onBranchSelectedInBranchSelectionContentFragment(
        this, branchId);
  }

  _renderContentOnRender(render: PanelWrapper): void {
    this._fBranches.attachRender(render);
    this._fBranches.render();
  }
}

export default FvcBranchSelection;
