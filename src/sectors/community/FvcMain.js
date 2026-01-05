import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FvcProposalList } from './FvcProposalList.js';
import { FvcMemberList } from './FvcMemberList.js';
import { FvcGlobalCommunity } from './FvcGlobalCommunity.js';
import { FvcUserCommunity } from './FvcUserCommunity.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';

export class FvcMain extends FViewContentMux {
  #fProposals;
  #fMemberList;
  #fGlobal;
  #fOverview;

  constructor() {
    super();
    this.#fProposals = new FvcProposalList();
    this.#fMemberList = new FvcMemberList();
    this.#fGlobal = new FvcGlobalCommunity();
    this.#fOverview = new FvcUserCommunity();
    this.#fOverview.setDelegate(this);

    this.#resetTabs();
  }

  onNewProposalRequestedInUserCommunityContentFragment(fUCC) {
    this.#fProposals.reload();
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
      this.#resetTabs();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  #resetTabs() {
    this.clearContents();
    this.#fOverview.setUserId(WebConfig.getOwnerId());
    this.#fProposals.setCommunityId(window.dba.Account.getCommunityId());
    this.#fMemberList.setCommunityId(window.dba.Account.getCommunityId());
    this.#fGlobal.setUserId(window.dba.Account.getId());

    this.addTab(
        {name : R.t("Overview"), value : "OVERVIEW", icon : ICON.COMMUNITY},
        this.#fOverview);

    if (window.dba.Account.isInCommunity(WebConfig.getOwner().getCommunityId())) {
      this.addTab(
          {name : R.t("Proposals"), value : "PROPOSALS", icon : ICON.ARTICLE},
          this.#fProposals);
      this.addTab(
          {name : R.t("Members"), value : "MEMBERS", icon : ICON.GROUP},
          this.#fMemberList);
    }

    this.addTab(
        {name : R.t("Global"), value : "GLOBAL", icon : ICON.EXPLORER},
        this.#fGlobal);

    this.switchTo("OVERVIEW");
  }
}
