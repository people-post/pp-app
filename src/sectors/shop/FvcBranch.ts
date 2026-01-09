import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FBranch } from './FBranch.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class FvcBranch extends FScrollViewContent {
  private _fBranch: FBranch;

  constructor() {
    super();
    this._fBranch = new FBranch();
    this._fBranch.setDelegate(this);
    this.setChild("branch", this._fBranch);
  }

  setBranchId(id: string): void { this._fBranch.setBranchId(id); }
  setEnableEdit(b: boolean): void { this._fBranch.setEnableEdit(b); }

  onBranchFragmentRequestShowView(_fBranch: FBranch, view: View, title: string): void {
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, view, title);
  }
  onClickInBranchFragment(_fBranch: FBranch, _branchId: string): void {}

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this._fBranch.attachRender(render);
    this._fBranch.render();
  }
}

export default FvcBranch;
