export const CF_PROPOSAL = {
  VIEW_PROPOSAL : Symbol(),
  VOTE : Symbol(),
  USER_INFO : Symbol(),
} as const;

const _CFT_PROPOSAL = {
  STATUS : `__STATUS__ __T_UPDATE__ ago`,
  REP_VOTE_STATUS : `Delegated vote: __STATUS__`,
  USER_VOTE_STATUS : `Your vote: __STATUS__`,
  SUBTITLE : `
  <div>Author: __AUTHOR__</div>
  <div>Proposed at: __T_CREATE__</div>
  <div>Updated at: __T_UPDATE__</div>
  <div>Status: __STATUS__</div>`,
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcConfirmAction } from '../../lib/ui/controllers/views/FvcConfirmAction.js';
import { FProposalTitle } from './FProposalTitle.js';
import { VotingSummaryFragment } from '../../common/gui/VotingSummaryFragment.js';
import { Communities } from '../../common/dba/Communities.js';
import { Votes } from '../../common/dba/Votes.js';
import { Proposal } from '../../common/datatypes/Proposal.js';
import { Vote } from '../../common/datatypes/Vote.js';
import { T_DATA, T_ACTION } from '../../common/plt/Events.js';
import { STATE } from '../../common/constants/Constants.js';
import { Events, T_ACTION as FwkT_ACTION } from '../../lib/framework/Events.js';
import { Utilities } from '../../common/Utilities.js';
import { PProposal } from './PProposal.js';
import { PProposalInfo } from './PProposalInfo.js';
import { R } from '../../common/constants/R.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import type { PProposalBase } from './PProposalBase.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Account } from '../../common/dba/Account.js';

interface ProposalDataSource {
  isProposalSelectedInProposalFragment(f: FProposal, proposalId: string): boolean;
}

interface ProposalDelegate {
  onProposalFragmentRequestShowProposal(f: FProposal, proposalId: string): void;
}

export class FProposal extends Fragment {
  static T_LAYOUT = {
    FULL : Symbol(),
    INFO: Symbol(),
  } as const;

  protected _fTitle: FProposalTitle;
  protected _fVotingSummary: VotingSummaryFragment;
  protected _proposalId: string | null = null;
  protected _tLayout: symbol | null = null;
  protected _dataSource!: ProposalDataSource;
  protected _delegate!: ProposalDelegate;

  constructor() {
    super();
    this._fTitle = new FProposalTitle();
    this._fTitle.setDataSource(this);
    this.setChild("title", this._fTitle);

    this._fVotingSummary = new VotingSummaryFragment();
    this.setChild("voting_summary", this._fVotingSummary);
  }

  setProposalId(id: string | null): void { this._proposalId = id; }
  setLayoutType(t: symbol | null): void { this._tLayout = t; }

  getProposalForProposalTitleFragment(_fTitle: FProposalTitle): Proposal | null {
    if (!this._proposalId) {
      return null;
    }
    return Communities.getProposal(this._proposalId);
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_PROPOSAL.VIEW_PROPOSAL:
      this.#onViewProposal();
      break;
    case CF_PROPOSAL.VOTE:
      this.#onShowVote();
      break;
    case CF_PROPOSAL.USER_INFO:
      this.#onShowUserInfo(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.COMMUNITY_PROFILE:
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    case T_DATA.PROPOSAL:
      if (data instanceof Proposal && data.getId() == this._proposalId) {
        this.render();
      }
      break;
    case T_DATA.VOTE:
      if (data instanceof Vote && data.getItemId() == this._proposalId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Panel): void {
    if (!this._proposalId) {
      return;
    }

    let proposal = Communities.getProposal(this._proposalId);
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

  #createPanel(): PProposalBase {
    let p: PProposalBase;
    switch (this._tLayout) {
    case FProposal.T_LAYOUT.FULL:
      p = new PProposal();
      break;
    default:
      p = this.#createInfoPanel();
      break;
    }
    return p;
  }

  #createInfoPanel(): PProposalInfo {
    let p = new PProposalInfo();
    p.setAttribute("onclick",
                   "javascript:G.action(cmut.CF_PROPOSAL.VIEW_PROPOSAL)");
    return p;
  }

  #renderIcon(proposal: Proposal, panel: Panel): void {
    let icon = proposal.getIcon();
    let s: string;
    if (icon) {
      s = Utilities.renderSvgFuncIcon(icon);
    } else {
      s = "";
    }
    panel.replaceContent(s);
  }

  #renderTitle(_proposal: Proposal, panel: Panel): void {
    this._fTitle.attachRender(panel);
    this._fTitle.render();
  }

  #renderStatus(proposal: Proposal, panel: Panel): void {
    let s = _CFT_PROPOSAL.STATUS;
    s = s.replace("__STATUS__", Utilities.renderStatus(proposal.getState(),
                                                       proposal.getStatus()));
    s = s.replace("__T_UPDATE__",
                  Utilities.renderTimeDiff(proposal.getUpdateTime()));
    panel.replaceContent(s);
  }

  #renderVote(proposal: Proposal, panel: Panel): void {
    let s: string;
    let v = Votes.get(Account.getId(), proposal.getId());
    if (v) {
      s = this.#renderUserVoteStatus(v.getValue());
    } else {
      let rId = Account.getRepresentativeId();
      if (rId) {
        v = Votes.get(rId, proposal.getId());
      }
      if (v) {
        s = this.#renderRepresentativeVoteStatus(v.getValue());
      } else {
        if (proposal.getState() == STATE.FINISHED) {
          s = this.#renderUserVoteStatus("N/A");
        } else {
          s = this.#renderUserVoteAction();
        }
      }
    }
    panel.replaceContent(s);
  }

  #renderVotingSummary(proposal: Proposal, panel: Panel): void {
    this._fVotingSummary.setSummary(proposal.getVotingResult());
    this._fVotingSummary.attachRender(panel);
    this._fVotingSummary.render();
  }

  #renderRepresentativeVoteStatus(voteValue: string | null): string {
    let s = _CFT_PROPOSAL.REP_VOTE_STATUS;
    if (voteValue) {
      s = s.replace("__STATUS__", voteValue);
    } else {
      s = s.replace("__STATUS__", "N/A");
    }
    return s;
  }

  #renderUserVoteStatus(voteValue: string | null): string {
    let s = _CFT_PROPOSAL.USER_VOTE_STATUS;
    if (voteValue) {
      s = s.replace("__STATUS__", voteValue);
    } else {
      s = s.replace("__STATUS__", "N/A");
    }
    return s;
  }

  #renderSubtitle(proposal: Proposal, panel: Panel): void {
    let s = _CFT_PROPOSAL.SUBTITLE;
    let userId = proposal.getAuthorId();
    let nickname = Account.getUserNickname(userId);
    s = s.replace("__AUTHOR__", Utilities.renderSmallButton(
                                    "cmut.CF_PROPOSAL.USER_INFO", userId,
                                    nickname, "low-profile s-cinfotext bold"));
    s = s.replace("__T_CREATE__", UtilitiesExt.timestampToDateTimeString(
                                      proposal.getCreationTime() / 1000));
    s = s.replace("__T_UPDATE__", UtilitiesExt.timestampToDateTimeString(
                                      proposal.getUpdateTime() / 1000));
    s = s.replace("__STATUS__", Utilities.renderStatus(proposal.getState(),
                                                       proposal.getStatus()));
    panel.replaceContent(s);
  }

  #renderContent(proposal: Proposal, panel: Panel): void {
    let s = proposal.getAbstract();
    if (!s) {
      switch (proposal.getType()) {
      case Proposal.T_TYPE.ISSUE_COINS:
        s = this.#makeIssueCoinContent(proposal.getData());
        break;
      case Proposal.T_TYPE.CONFIG_CHANGE:
        s = this.#makeChangeConfigContent(proposal.getCommunityId(),
                                          proposal.getData());
        break;
      case Proposal.T_TYPE.NEW_MEMBER:
        s = this.#makeMemberApplicationContent(proposal.getData());
        break;
      default:
        s = "";
        break;
      }
    }
    panel.replaceContent(s);
  }

  #renderUserVoteAction(): string {
    return Utilities.renderSmallButton("cmut.CF_PROPOSAL.VOTE", "", "Vote...");
  }

  #makeChangeConfigContent(communityId: string, data: unknown): string {
    let dataObj = data as { old?: unknown; new?: unknown };
    let oldConfig = dataObj.old;
    if (!oldConfig) {
      let p = Communities.get(communityId);
      if (!p) {
        return "...";
      }
      oldConfig = p.getConfig();
    }

    let diffs = this.#getObjectDiffs(dataObj.new, oldConfig);
    let items: string[] = [];
    for (let diff of diffs) {
      items.push(this.#renderDiffData(diff));
    }
    return items.join("<br>");
  }

  #renderDiffData(data: { name: string; diffs?: unknown[]; old?: unknown; new?: unknown }): string {
    if (data.diffs) {
      let items: string[] = [];
      for (let diff of data.diffs) {
        items.push(this.#renderDiffData(diff as { name: string; diffs?: unknown[]; old?: unknown; new?: unknown }));
      }
      return data.name + ":<br>" + items.join("<br>");
    } else {
      return data.name + ": " + String(data.old) + " -> " + String(data.new);
    }
  }

  #getObjectDiffs(newObj: unknown, oldObj: unknown): Array<{ name: string; diffs?: unknown[]; old?: unknown; new?: unknown }> {
    if (!newObj || typeof newObj !== 'object') {
      return [];
    }
    let items: Array<{ name: string; diffs?: unknown[]; old?: unknown; new?: unknown }> = [];
    for (let [k, v] of Object.entries(newObj)) {
      let oldObjTyped = oldObj as Record<string, unknown> | null;
      let vOld = oldObjTyped ? oldObjTyped[k] : null;
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

  #makeIssueCoinContent(_data: unknown): string { return "Empty"; }
  #makeMemberApplicationContent(data: unknown): string {
    let dataObj = data as { message?: string };
    return dataObj.message || "";
  }

  #onShowUserInfo(userId: string): void {
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }

  #onViewProposal(): void {
    if (this._proposalId) {
      this._delegate.onProposalFragmentRequestShowProposal(this,
                                                           this._proposalId);
    }
  }

  #onShowVote(): void {
    let v = new View();
    let f = new FvcConfirmAction();
    f.setMessage(R.get("PROMPT_VOTE"));
    f.addOption("YEA", () => this.#onVote(Vote.T_VALUE.YEA));
    f.addOption("NAY", () => this.#onVote(Vote.T_VALUE.NAY));
    f.addOption("Cancel", null, true);
    v.setContentFragment(f);
    Events.triggerTopAction(FwkT_ACTION.SHOW_DIALOG, this, v, "Choices",
                                false);
  }

  #onVote(value: string): void {
    if (this._proposalId) {
      Communities.asyncVote(this._proposalId, value);
    }
  }
}
