(function(cmut) {
cmut.CF_PROPOSAL = {
  VIEW_PROPOSAL : Symbol(),
  VOTE : Symbol(),
  USER_INFO : Symbol(),
};

const _CFT_PROPOSAL = {
  STATUS : `__STATUS__ __T_UPDATE__ ago`,
  REP_VOTE_STATUS : `Delegated vote: __STATUS__`,
  USER_VOTE_STATUS : `Your vote: __STATUS__`,
  SUBTITLE : `
  <div>Author: __AUTHOR__</div>
  <div>Proposed at: __T_CREATE__</div>
  <div>Updated at: __T_UPDATE__</div>
  <div>Status: __STATUS__</div>`,
};

class FProposal extends ui.Fragment {
  static T_LAYOUT = {
    FULL : Symbol(),
    INFO: Symbol(),
  };

  constructor() {
    super();
    this._fTitle = new cmut.FProposalTitle();
    this._fTitle.setDataSource(this);
    this.setChild("title", this._fTitle);

    this._fVotingSummary = new gui.VotingSummaryFragment();
    this.setChild("voting_summary", this._fVotingSummary);

    this._proposalId = null;
    this._tLayout = null;
  }

  setProposalId(id) { this._proposalId = id; }
  setLayoutType(t) { this._tLayout = t; }

  getProposalForProposalTitleFragment(fTitle) {
    return dba.Communities.getProposal(this._proposalId);
  }

  action(type, ...args) {
    switch (type) {
    case cmut.CF_PROPOSAL.VIEW_PROPOSAL:
      this.#onViewProposal();
      break;
    case cmut.CF_PROPOSAL.VOTE:
      this.#onShowVote();
      break;
    case cmut.CF_PROPOSAL.USER_INFO:
      this.#onShowUserInfo(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.COMMUNITY_PROFILE:
    case plt.T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    case plt.T_DATA.PROPOSAL:
      if (data.getId() == this._proposalId) {
        this.render();
      }
      break;
    case plt.T_DATA.VOTE:
      if (data.getItemId() == this._proposalId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let proposal = dba.Communities.getProposal(this._proposalId);
    if (!proposal) {
      return;
    }

    let pMain = this.#createPanel();
    render.wrapPanel(pMain);

    if (pMain.isColorInvertible() &&
        this._dataSource.isProposalSelectedInProposalFragment(
            this, this._proposalId)) {
      pMain.invertColor();
    }

    let p = pMain.getIconPanel();
    if (p) {
      this.#renderIcon(proposal, p);
    }

    p = pMain.getTitlePanel();
    this.#renderTitle(proposal, p);

    p = pMain.getSubtitlePanel();
    if (p) {
      this.#renderSubtitle(proposal, p);
    }

    p = pMain.getContentPanel();
    if (p) {
      this.#renderContent(proposal, p);
    }

    p = pMain.getStatusPanel();
    if (p) {
      this.#renderStatus(proposal, p);
    }

    p = pMain.getVotePanel();
    if (p) {
      this.#renderVote(proposal, p);
    }

    p = pMain.getVotingSummaryPanel();
    this.#renderVotingSummary(proposal, p);
  }

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.FULL:
      p = new cmut.PProposal();
      break;
    default:
      p = this.#createInfoPanel()
      break;
    }
    return p;
  }

  #createInfoPanel() {
    let p = new cmut.PProposalInfo();
    p.setAttribute("onclick",
                   "javascript:G.action(cmut.CF_PROPOSAL.VIEW_PROPOSAL)");
    return p;
  }

  #renderIcon(proposal, panel) {
    let icon = proposal.getIcon();
    let s;
    if (icon) {
      s = Utilities.renderSvgFuncIcon(icon);
    } else {
      s = "";
    }
    panel.replaceContent(s);
  }

  #renderTitle(proposal, panel) {
    this._fTitle.attachRender(panel);
    this._fTitle.render();
  }

  #renderStatus(proposal, panel) {
    let s = _CFT_PROPOSAL.STATUS;
    s = s.replace("__STATUS__", Utilities.renderStatus(proposal.getState(),
                                                       proposal.getStatus()));
    s = s.replace("__T_UPDATE__",
                  Utilities.renderTimeDiff(proposal.getUpdateTime()));
    panel.replaceContent(s);
  }

  #renderVote(proposal, panel) {
    let s;
    let v = dba.Votes.get(dba.Account.getId(), proposal.getId());
    if (v) {
      s = this.#renderUserVoteStatus(v.getValue());
    } else {
      let rId = dba.Account.getRepresentativeId();
      if (rId) {
        v = dba.Votes.get(rId, proposal.getId());
      }
      if (v) {
        s = this.#renderRepresentativeVoteStatus(v.getValue());
      } else {
        if (proposal.getState() == C.STATE.FINISHED) {
          s = this.#renderUserVoteStatus("N/A");
        } else {
          s = this.#renderUserVoteAction();
        }
      }
    }
    panel.replaceContent(s);
  }

  #renderVotingSummary(proposal, panel) {
    this._fVotingSummary.setSummary(proposal.getVotingResult());
    this._fVotingSummary.attachRender(panel);
    this._fVotingSummary.render();
  }

  #renderRepresentativeVoteStatus(voteValue) {
    let s = _CFT_PROPOSAL.REP_VOTE_STATUS;
    if (voteValue) {
      s = s.replace("__STATUS__", voteValue);
    } else {
      s = s.replace("__STATUS__", "N/A");
    }
    return s;
  }

  #renderUserVoteStatus(voteValue) {
    let s = _CFT_PROPOSAL.USER_VOTE_STATUS;
    if (voteValue) {
      s = s.replace("__STATUS__", voteValue);
    } else {
      s = s.replace("__STATUS__", "N/A");
    }
    return s;
  }

  #renderSubtitle(proposal, panel) {
    let s = _CFT_PROPOSAL.SUBTITLE;
    let userId = proposal.getAuthorId();
    let nickname = dba.Account.getUserNickname(userId);
    s = s.replace("__AUTHOR__", Utilities.renderSmallButton(
                                    "cmut.CF_PROPOSAL.USER_INFO", userId,
                                    nickname, "low-profile s-cinfotext bold"));
    s = s.replace("__T_CREATE__", ext.Utilities.timestampToDateTimeString(
                                      proposal.getCreationTime() / 1000));
    s = s.replace("__T_UPDATE__", ext.Utilities.timestampToDateTimeString(
                                      proposal.getUpdateTime() / 1000));
    s = s.replace("__STATUS__", Utilities.renderStatus(proposal.getState(),
                                                       proposal.getStatus()));
    panel.replaceContent(s);
  }

  #renderContent(proposal, panel) {
    let s = proposal.getAbstract();
    if (!s) {
      switch (proposal.getType()) {
      case dat.Proposal.T_TYPE.ISSUE_COINS:
        s = this.#makeIssueCoinContent(proposal.getData());
        break;
      case dat.Proposal.T_TYPE.CONFIG_CHANGE:
        s = this.#makeChangeConfigContent(proposal.getCommunityId(),
                                          proposal.getData());
        break;
      case dat.Proposal.T_TYPE.NEW_MEMBER:
        s = this.#makeMemberApplicationContent(proposal.getData());
        break;
      default:
        s = "";
        break;
      }
    }
    panel.replaceContent(s);
  }

  #renderUserVoteAction() {
    return Utilities.renderSmallButton("cmut.CF_PROPOSAL.VOTE", "", "Vote...");
  }

  #makeChangeConfigContent(communityId, data) {
    let oldConfig = data.old;
    if (!oldConfig) {
      let p = dba.Communities.get(communityId);
      if (!p) {
        return "...";
      }
      oldConfig = p.getConfig();
    }

    let diffs = this.#getObjectDiffs(data.new, oldConfig);
    let items = [];
    for (let diff of diffs) {
      items.push(this.#renderDiffData(diff));
    }
    return items.join("<br>");
  }

  #renderDiffData(data) {
    if (data.diffs) {
      let items = [];
      for (let diff of data.diffs) {
        items.push(this.#renderDiffData(diff));
      }
      return data.name + ":<br>" + items.join("<br>");
    } else {
      return data.name + ": " + data.old + " -> " + data.new;
    }
  }

  #getObjectDiffs(newObj, oldObj) {
    if (!newObj) {
      return [];
    }
    let items = [];
    for (let [k, v] of Object.entries(newObj)) {
      let vOld = oldObj ? oldObj[k] : null;
      if (vOld != v) {
        if (v instanceof Object) {
          let subDiffs = this.#getObjectDiffs(v, vOld);
          if (subDiffs.length) {
            items.push({"name" : k, "diffs" : subDiffs});
          }
        } else {
          items.push({"name" : k, "old" : vOld, "new" : v});
        }
      }
    }
    return items;
  }

  #makeIssueCoinContent(data) { return "Empty"; }
  #makeMemberApplicationContent(data) { return data.message; }

  #onShowUserInfo(userId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }

  #onViewProposal() {
    this._delegate.onProposalFragmentRequestShowProposal(this,
                                                         this._proposalId);
  }

  #onShowVote() {
    let v = new ui.View();
    let f = new ui.FvcConfirmAction();
    f.setMessage(R.get("PROMPT_VOTE"));
    f.addOption("YEA", () => this.#onVote(dat.Vote.T_VALUE.YEA));
    f.addOption("NAY", () => this.#onVote(dat.Vote.T_VALUE.NAY));
    f.addOption("Cancel", null, true);
    v.setContentFragment(f);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Choices",
                                false);
  }

  #onVote(value) { dba.Communities.asyncVote(this._proposalId, value); }
};

cmut.FProposal = FProposal;
}(window.cmut = window.cmut || {}));
