import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FBranch } from './FBranch.js';

export class FvcBranch extends FScrollViewContent {
  constructor() {
    super();
    this._fBranch = new FBranch();
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
