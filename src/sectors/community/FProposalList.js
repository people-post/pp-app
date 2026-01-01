import { View } from '../../lib/ui/controllers/views/View.js';
import { Proposal } from '../../common/datatypes/Proposal.js';
import { DefaultLongList } from '../../common/gui/DefaultLongList.js';
import { Communities } from '../../common/dba/Communities.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { api } from '../../common/plt/Api.js';
import { FProposal } from './FProposal.js';
import { FvcProposal } from './FvcProposal.js';

export class FProposalList extends DefaultLongList {
  constructor() {
    super();
    this._communityId;
  }

  isProposalSelectedInProposalFragment(fProposal, proposalId) {
    return this._currentId == proposalId;
  }

  getCurrentProposal() { return Communities.getProposal(this._currentId); }
  getPreviousProposalId() {
    return UtilitiesExt.findItemBefore(this._ids, this._currentId);
  }
  getNextProposalId() {
    return UtilitiesExt.findItemAfter(this._ids, this._currentId);
  }

  setCommunityId(id) { this._communityId = id; }

  onProposalFragmentRequestShowProposal(fInfo, proposalId) {
    this.switchToItem(proposalId);
  }

  reload() {
    this._ids = [];
    this._isIdsComplete = false;
    this._fItems.reload();
  }

  _createInfoFragment(id) {
    let f = new FProposal();
    f.setProposalId(id);
    f.setDataSource(this);
    f.setDelegate(this);
    return f;
  }

  _createItemView(id) {
    let v = new View();
    let f = new FvcProposal();
    f.setProposalId(id);
    v.setContentFragment(f);
    return v;
  }

  _asyncLoadItems() {
    if (this._isBatchLoading) {
      return;
    }
    this._isBatchLoading = true;
    let url = "api/community/proposals?community_id=" + this._communityId;
    if (this._ids.length) {
      url += "&before_id=" + this._ids[this._ids.length - 1];
    }
    api.asyncRawCall(url, r => this.#onProposalsRRR(r));
  }

  #onProposalsRRR(responseText) {
    this._isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this._owner.onRemoteErrorInFragment(this, response.error);
    } else {
      let proposals = [];
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
