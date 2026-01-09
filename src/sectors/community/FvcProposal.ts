import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FProposal } from './FProposal.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcProposal extends FScrollViewContent {
  protected _fProposal: FProposal;

  constructor() {
    super();
    this._fProposal = new FProposal();
    this._fProposal.setLayoutType(FProposal.T_LAYOUT.FULL);
    this.setChild("proposal", this._fProposal);
  }

  setProposalId(id: string | null): void { this._fProposal.setProposalId(id); }

  _renderContentOnRender(render: Render): void {
    this._fProposal.attachRender(render);
    this._fProposal.render();
  }
}
