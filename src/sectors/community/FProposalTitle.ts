export const CF_PROPOSAL_TITLE = {
  USER_INFO : "CF_PROPOSAL_TITLE_1",
} as const;

// Export to window for HTML string templates
declare global {
  interface Window {
    CF_PROPOSAL_TITLE?: typeof CF_PROPOSAL_TITLE;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_PROPOSAL_TITLE = CF_PROPOSAL_TITLE;
}

const _CFT_PROPOSAL_TITLE = {
  NEW_MEMBER : `Membership request by __USER__`,
  ISSUE_COINS : `Issue __TOTAL__M coins`,
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Proposal } from '../../common/datatypes/Proposal.js';
import { T_DATA, T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { Utilities } from '../../common/Utilities.js';

interface ProposalTitleDataSource {
  getProposalForProposalTitleFragment(): Proposal | null;
}

export class FProposalTitle extends Fragment {
  protected _dataSource!: ProposalTitleDataSource;

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_PROPOSAL_TITLE.USER_INFO:
      this.#showUserInfo(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContent(): string {
    let proposal = this._dataSource.getProposalForProposalTitleFragment();
    if (!proposal) {
      return "";
    }
    return this.#makeProposalTitle(proposal);
  }

  #makeProposalTitle(proposal: Proposal): string {
    let t = proposal.getTitle();
    if (t) {
      return t;
    }
    return this.#makeProposalTitleFromData(proposal);
  }

  #makeProposalTitleFromData(proposal: Proposal): string {
    switch (proposal.getType()) {
    case Proposal.T_TYPE.ISSUE_COINS:
      return this.#makeIssueCoinTitle(proposal.getData() as { total: number });
      break;
    case Proposal.T_TYPE.CONFIG_CHANGE:
      return this.#makeChangeConfigTitle(proposal.getData());
      break;
    case Proposal.T_TYPE.NEW_MEMBER:
      return this.#makeMemberApplicationTitle(proposal);
      break;
    default:
      break;
    }
    return "";
  }

  #makeMemberApplicationTitle(proposal: Proposal): string {
    let s = _CFT_PROPOSAL_TITLE.NEW_MEMBER;
    let userId = proposal.getAuthorId();
    let nickname = window.dba.Account.getUserNickname(userId);
    s = s.replace("__USER__",
                  Utilities.renderSmallButton("CF_PROPOSAL_TITLE.USER_INFO",
                                              userId, nickname));
    return s;
  }

  #makeChangeConfigTitle(_data: unknown): string { return "Config change"; }

  #makeIssueCoinTitle(data: { total: number }): string {
    let s = _CFT_PROPOSAL_TITLE.ISSUE_COINS;
    s = s.replace("__TOTAL__", String(data.total));
    return s;
  }

  #showUserInfo(userId: string): void {
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }
}
