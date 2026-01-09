import { View } from '../../lib/ui/controllers/views/View.js';
import { Proposal } from '../../common/datatypes/Proposal.js';
import { DefaultLongList } from '../../common/gui/DefaultLongList.js';
import { Communities } from '../../common/dba/Communities.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { FProposal } from './FProposal.js';
import { FvcProposal } from './FvcProposal.js';
import { api } from '../../lib/framework/Global.js';

export class FProposalList extends DefaultLongList {
  protected _communityId: string | null = null;

  constructor() {
    super();
  }

  isProposalSelectedInProposalFragment(_fProposal: FProposal, proposalId: string): boolean {
    return this._currentId == proposalId;
  }

  getCurrentProposal(): Proposal | null { return Communities.getProposal(this._currentId); }
  getPreviousProposalId(): string | null {
    return UtilitiesExt.findItemBefore(this._ids, this._currentId);
  }
  getNextProposalId(): string | null {
    return UtilitiesExt.findItemAfter(this._ids, this._currentId);
  }

  setCommunityId(id: string | null): void { this._communityId = id; }

  onProposalFragmentRequestShowProposal(_fInfo: FProposal, proposalId: string): void {
    this.switchToItem(proposalId);
  }

  reload(): void {
    this._ids = [];
    this._isIdsComplete = false;
    this._fItems.reload();
  }

  _createInfoFragment(id: string): FProposal {
    let f = new FProposal();
    f.setProposalId(id);
    f.setDataSource(this);
    f.setDelegate(this);
    return f;
  }

  _createItemView(id: string): View {
    let v = new View();
    let f = new FvcProposal();
    f.setProposalId(id);
    v.setContentFragment(f);
    return v;
  }

  _asyncLoadItems(): void {
    if (this._isBatchLoading) {
      return;
    }
    if (!this._communityId) {
      return;
    }

    this._isBatchLoading = true;
    let url = "api/community/proposals?community_id=" + this._communityId;
    if (this._ids.length) {
      url += "&before_id=" + this._ids[this._ids.length - 1];
    }
    api.asyncRawCall(url, r => this.#onProposalsRRR(r));
  }

  #onProposalsRRR(responseText: string): void {
    this._isBatchLoading = false;
    let response = JSON.parse(responseText) as { error?: string; data?: { proposals: unknown[] } };
    if (response.error) {
      this._owner.onRemoteErrorInFragment(this, response.error);
    } else if (response.data) {
      let proposals: Proposal[] = [];
      for (let p of response.data.proposals) {
        proposals.push(new Proposal(p));
      }
      if (proposals.length) {
        for (let p of proposals) {
          Communities.updateProposal(new Proposal(p));
          this._ids.push(p.getId());
        }
      } else {
        this._isIdsComplete = true;
      }
      this._fItems.onScrollFinished();
    }
  }
}
