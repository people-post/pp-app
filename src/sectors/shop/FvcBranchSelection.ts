import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FBranchList } from './FBranchList.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class FvcBranchSelection extends FScrollViewContent {
  private _fBranches: FBranchList;

  constructor() {
    super();
    this._fBranches = new FBranchList();
    this._fBranches.setDelegate(this);
    this.setChild("branches", this._fBranches);
  }

  onBranchListFragmentRequestShowView(_fBranchList: FBranchList, view: View, title: string): void {
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, view, title);
  }

  onBranchSelectedInBranchListFragment(_fBranchList: FBranchList, branchId: string): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onBranchSelectedInBranchSelectionContentFragment?.(
        this, branchId);
  }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this._fBranches.attachRender(render);
    this._fBranches.render();
  }
}

export default FvcBranchSelection;
