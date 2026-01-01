import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FProposal } from './FProposal.js';

export class FvcProposal extends FScrollViewContent {
  constructor() {
    super();
    this._fProposal = new FProposal();
    this._fProposal.setLayoutType(FProposal.T_LAYOUT.FULL);
    this.setChild("proposal", this._fProposal);
  }

  setProposalId(id) { this._fProposal.setProposalId(id); }

  _renderContentOnRender(render) {
    this._fProposal.attachRender(render);
    this._fProposal.render();
  }
};
