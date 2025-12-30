
window.CF_PROPOSAL_TITLE = {
  USER_INFO : "CF_PROPOSAL_TITLE_1",
}

const _CFT_PROPOSAL_TITLE = {
  NEW_MEMBER : `Membership request by __USER__`,
  ISSUE_COINS : `Issue __TOTAL__M coins`,
}

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Proposal } from '../../common/datatypes/Proposal.js';

export class FProposalTitle extends Fragment {
  action(type, ...args) {
    switch (type) {
    case CF_PROPOSAL_TITLE.USER_INFO:
      this.#showUserInfo(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContent() {
    let proposal = this._dataSource.getProposalForProposalTitleFragment();
    if (!proposal) {
      return "";
    }
    return this.#makeProposalTitle(proposal);
  }

  #makeProposalTitle(proposal) {
    let t = proposal.getTitle();
    if (t) {
      return t;
    }
    return this.#makeProposalTitleFromData(proposal);
  }

  #makeProposalTitleFromData(proposal) {
    switch (proposal.getType()) {
    case Proposal.T_TYPE.ISSUE_COINS:
      return this.#makeIssueCoinTitle(proposal.getData());
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

  #makeMemberApplicationTitle(proposal) {
    let s = _CFT_PROPOSAL_TITLE.NEW_MEMBER;
    let userId = proposal.getAuthorId();
    let nickname = dba.Account.getUserNickname(userId);
    s = s.replace("__USER__",
                  Utilities.renderSmallButton("CF_PROPOSAL_TITLE.USER_INFO",
                                              userId, nickname));
    return s;
  }

  #makeChangeConfigTitle(data) { return "Config change"; }

  #makeIssueCoinTitle(data) {
    let s = _CFT_PROPOSAL_TITLE.ISSUE_COINS;
    s = s.replace("__TOTAL__", data.total);
    return s;
  }

  #showUserInfo(userId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cmut = window.cmut || {};
  window.cmut.FProposalTitle = FProposalTitle;
}
