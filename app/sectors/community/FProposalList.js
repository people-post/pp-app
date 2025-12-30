export class FProposalList extends gui.DefaultLongList {
  constructor() {
    super();
    this._communityId;
  }

  isProposalSelectedInProposalFragment(fProposal, proposalId) {
    return this._currentId == proposalId;
  }

  getCurrentProposal() { return dba.Communities.getProposal(this._currentId); }
  getPreviousProposalId() {
    return ext.Utilities.findItemBefore(this._ids, this._currentId);
  }
  getNextProposalId() {
    return ext.Utilities.findItemAfter(this._ids, this._currentId);
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
    let f = new cmut.FProposal();
    f.setProposalId(id);
    f.setDataSource(this);
    f.setDelegate(this);
    return f;
  }

  _createItemView(id) {
    let v = new ui.View();
    let f = new cmut.FvcProposal();
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
    plt.Api.asyncRawCall(url, r => this.#onProposalsRRR(r));
  }

  #onProposalsRRR(responseText) {
    this._isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this._owner.onRemoteErrorInFragment(this, response.error);
    } else {
      let proposals = [];
      for (let p of response.data.proposals) {
        proposals.push(new dat.Proposal(p));
      }
      if (proposals.length) {
        for (let p of proposals) {
          dba.Communities.updateProposal(new dat.Proposal(p));
          this._ids.push(p.getId());
        }
      } else {
        this._isIdsComplete = true;
      }
      this._fItems.onScrollFinished();
    }
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.cmut = window.cmut || {};
  window.cmut.FProposalList = FProposalList;
}
