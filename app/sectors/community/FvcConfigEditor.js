(function(cmut) {
class FvcConfigEditor extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fCaptain = new S.hr.FUserIdInput();
    this._fMemberProfitPercent = new ui.NumberInput();
    this._fNJoinApprovals = new ui.NumberInput();
    this._fVotingThreshold = new ui.NumberInput();
    this._fDaysToExpire = new ui.NumberInput();
    this._fTribute = new gui.FTributetInput();

    this._fActions = new ui.ButtonList();
    this._fActions.setDelegate(this);
    this._fActions.addButton("Propose", () => this.#asyncPropose());
    this._fActions.addButton(
        "Cancel", () => this._owner.onContentFragmentRequestPopView(this),
        true);

    this.setChild("captain", this._fCaptain);
    this.setChild("memberPP", this._fMemberProfitPercent);
    this.setChild("nJoinApprovals", this._fNJoinApprovals);
    this.setChild("daysToExpire", this._fDaysToExpire);
    this.setChild("votingThreshold", this._fVotingThreshold);
    this.setChild("tribute", this._fTribute);
    this.setChild("actions", this._fActions);

    this._communityId = null;
  }

  onInputChangeInTextArea(fTextArea, text) {}

  setCommunityId(communityId) {
    this._communityId = communityId;
    let community = dba.Communities.get(communityId);
    if (community) {
      this.#setConfig(community.getConfig());
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.COMMUNITY_PROFILE:
      if (this._communityId == data.id) {
        this.#setConfig(data.config);
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    let pMain = new ui.ListPanel();
    render.wrapPanel(pMain);

    let p = new ui.SectionPanel("Captain");
    pMain.pushPanel(p);
    this._fCaptain.attachRender(p.getContentPanel());
    this._fCaptain.render();

    p = new ui.SectionPanel("Admission");
    pMain.pushPanel(p);
    let pSplit = new ui.SplitPanel();
    p.getContentPanel().wrapPanel(pSplit);
    p = pSplit.getLeftPanel();
    p.setClassName("small-info-text");
    p.replaceContent("Member approvals needed to join community");
    this._fNJoinApprovals.attachRender(pSplit.getRightPanel());
    this._fNJoinApprovals.render();

    p = new ui.SectionPanel("Voting");
    pMain.pushPanel(p);
    let pList = new ui.ListPanel();
    p.getContentPanel().wrapPanel(pList);
    pSplit = new ui.SplitPanel();
    pList.pushPanel(pSplit);
    p = pSplit.getLeftPanel();
    p.setClassName("small-info-text");
    p.replaceContent("Threshold to pass propossals");
    this._fVotingThreshold.attachRender(pSplit.getRightPanel());
    this._fVotingThreshold.render();

    pSplit = new ui.SplitPanel();
    pList.pushPanel(pSplit);
    p = pSplit.getLeftPanel();
    p.setClassName("small-info-text");
    p.replaceContent("Number of calendar days for pospoal to accept votes");
    this._fDaysToExpire.attachRender(pSplit.getRightPanel());
    this._fDaysToExpire.render();

    if (dba.WebConfig.isDevSite()) {
      p = new ui.SectionPanel("Contribution");
      pMain.pushPanel(p);
      this._fTribute.attachRender(p.getContentPanel());
      this._fTribute.render();

      p = new ui.SectionPanel("Destribution");
      pMain.pushPanel(p);
      pSplit = new ui.SplitPanel();
      p.getContentPanel().wrapPanel(pSplit);
      p = pSplit.getLeftPanel();
      p.setClassName("small-info-text");
      p.replaceContent("Members' share");
      this._fMemberProfitPercent.attachRender(pSplit.getRightPanel());
      this._fMemberProfitPercent.render();
    }

    pMain.pushSpace(1);
    p = new ui.Panel();
    pMain.pushPanel(p);
    this._fActions.attachRender(p);
    this._fActions.render();
  }

  #collectFormData() {
    let fd = new FormData();
    fd.append('captain_id', this._fCaptain.getUserId());
    fd.append('n_join_approvals', this._fNJoinApprovals.getValue());
    fd.append('voting_threshold', this._fVotingThreshold.getValue());
    fd.append('days_to_expire', this._fDaysToExpire.getValue());
    fd.append('tribute', JSON.stringify(this._fTribute.getConfig()));
    fd.append('member_profit_share', this._fMemberProfitPercent.getValue());
    return fd;
  }

  #asyncPropose() {
    let fd = this.#collectFormData();
    let url = "api/community/propose_config";
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #onSubmitRRR(data) {
    this._delegate.onNewProposalRequestAcceptedInConfigEditorContentFragmet(
        this);
    this._owner.onContentFragmentRequestPopView(this);
  }

  #setConfig(config) {
    this._fCaptain.setUserId(config.captain_id);
    this._fNJoinApprovals.setConfig({
      max : 100,
      min : 1,
      step : 1,
      value : config.n_join_approvals,
      unit : ""
    });
    this._fVotingThreshold.setConfig({
      max : 100,
      min : 1,
      step : 1,
      value : config.voting_threshold,
      unit : "%"
    });
    this._fDaysToExpire.setConfig({
      max : 1000,
      min : 15,
      step : 1,
      value : config.days_to_expire,
      unit : "days"
    });
    this._fTribute.setConfig(config.tribute);
    this._fMemberProfitPercent.setConfig({
      max : 100,
      min : 0,
      step : 1,
      value : config.member_profit_share,
      unit : "%"
    });
  }
};

cmut.FvcConfigEditor = FvcConfigEditor;
}(window.cmut = window.cmut || {}));
