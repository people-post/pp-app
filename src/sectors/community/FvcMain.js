import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';

export class FvcMain extends FViewContentMux {
  #fProposals;
  #fMemberList;
  #fGlobal;
  #fOverview;

  constructor() {
    super();
    this.#fProposals = new cmut.FvcProposalList();
    this.#fMemberList = new cmut.FvcMemberList();
    this.#fGlobal = new cmut.FvcGlobalCommunity();
    this.#fOverview = new cmut.FvcUserCommunity();
    this.#fOverview.setDelegate(this);

    this.#resetTabs();
  }

  onNewProposalRequestedInUserCommunityContentFragment(fUCC) {
    this.#fProposals.reload();
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PROFILE:
      this.#resetTabs();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  #resetTabs() {
    this.clearContents();
    this.#fOverview.setUserId(dba.WebConfig.getOwnerId());
    this.#fProposals.setCommunityId(dba.Account.getCommunityId());
    this.#fMemberList.setCommunityId(dba.Account.getCommunityId());
    this.#fGlobal.setUserId(dba.Account.getId());

    this.addTab(
        {name : R.t("Overview"), value : "OVERVIEW", icon : C.ICON.COMMUNITY},
        this.#fOverview);

    if (dba.Account.isInCommunity(dba.WebConfig.getOwner().getCommunityId())) {
      this.addTab(
          {name : R.t("Proposals"), value : "PROPOSALS", icon : C.ICON.ARTICLE},
          this.#fProposals);
      this.addTab(
          {name : R.t("Members"), value : "MEMBERS", icon : C.ICON.GROUP},
          this.#fMemberList);
    }

    this.addTab(
        {name : R.t("Global"), value : "GLOBAL", icon : C.ICON.EXPLORER},
        this.#fGlobal);

    this.switchTo("OVERVIEW");
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.cmut = window.cmut || {};
  window.cmut.FvcMain = FvcMain;
}
