
const _CFT_COMMUNITY_OVERVIEW = {
  N_COINS : `__N_ACTIVE_COINS__ active/__N_TOTAL_COINS__ total`,
};

class FOverview extends ui.Fragment {
  #fHeaderEditor;
  #fCreator;
  #fCaptain;
  #fNameEditor;
  #fDescriptionEditor;
  #btnCoinInfo;
  #btnCashInfo;
  #btnJoin;
  #btnPropose;
  #btnConfig;
  #btnIssue;
  #communityId = null;

  constructor() {
    super();
    this.#fHeaderEditor = new cmut.FHeaderEditor();
    this.#fHeaderEditor.setDelegate(this);
    this.setChild("header", this.#fHeaderEditor);

    this.#fCreator = new S.hr.FUserInfo();
    this.#fCreator.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("creator", this.#fCreator);

    this.#fCaptain = new S.hr.FUserInfo();
    this.#fCaptain.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("captain", this.#fCaptain);

    this.#fNameEditor = new ui.TextInput();
    this.#fNameEditor.setClassName("no-border center-align s-csecondarybg");
    this.#fNameEditor.setDelegate(this);
    this.setChild("name", this.#fNameEditor);

    this.#fDescriptionEditor = new ui.TextArea();
    this.#fDescriptionEditor.setClassName(
        "w100 small-info-text implicit center-align s-csecondarybg");
    this.#fDescriptionEditor.setDelegate(this);
    this.setChild("description", this.#fDescriptionEditor);

    this.#btnCoinInfo = new ui.Button();
    this.#btnCoinInfo.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this.#btnCoinInfo.setValue("COIN_INFO");
    this.#btnCoinInfo.setName("Details");
    this.#btnCoinInfo.setDelegate(this);
    this.setChild("btnCoinInfo", this.#btnCoinInfo);

    this.#btnCashInfo = new ui.Button();
    this.#btnCashInfo.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this.#btnCashInfo.setValue("CASH_INFO");
    this.#btnCashInfo.setName("Details");
    this.#btnCashInfo.setDelegate(this);
    this.setChild("btnCashInfo", this.#btnCashInfo);

    this.#btnJoin = new ui.Button();
    this.#btnJoin.setValue("JOIN");
    this.#btnJoin.setName("Apply membership...");
    this.#btnJoin.setDelegate(this);
    this.setChild("btnJoin", this.#btnJoin);

    this.#btnPropose = new ui.Button();
    this.#btnPropose.setValue("PROPOSE");
    this.#btnPropose.setName("New proposal...");
    this.#btnPropose.setDelegate(this);
    this.setChild("btnPropose", this.#btnPropose);

    this.#btnConfig = new ui.Button();
    this.#btnConfig.setValue("CONFIG");
    this.#btnConfig.setName("Settings...");
    this.#btnConfig.setDelegate(this);
    this.setChild("btnConfig", this.#btnConfig);

    this.#btnIssue = new ui.Button();
    this.#btnIssue.setValue("ISSUE");
    this.#btnIssue.setName("Issue coins...");
    this.#btnIssue.setDelegate(this);
    this.setChild("btnIssue", this.#btnIssue);
  }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn.getValue()) {
    case "COIN_INFO":
      this.#onShowCoins();
      break;
    case "CASH_INFO":
      this.#onShowFinance();
      break;
    case "APPLY":
      this.#onApplyClicked();
      break;
    case "PROPOSE":
      this.#onProposeClicked();
      break;
    case "CONFIG":
      this.#onConfigClicked();
      break;
    case "ISSUE":
      this.#onIssueCoinClicked();
      break;
    default:
      break;
    }
  }

  onImageChangedInHeaderEditorFragment(fHeaderEditor) {
    if (this.#validateInput()) {
      this.#asyncUpdateProfile();
    }
  }

  onNewProposalRequestAcceptedInConfigEditorContentFragmet(
      fvcCommunityConfigEditor) {
    this._delegate.onNewProposalRequestAcceptedInOverviewFragment(this);
  }

  onInputChangeInTextInputFragment(fTextInput, text) {
    if (this.#validateInput()) {
      this.#asyncUpdateProfile();
    }
  }

  onInputChangeInTextArea(fTextArea, text) {
    if (this.#validateInput()) {
      this.#asyncUpdateProfile();
    }
  }

  setCommunityId(id) { this.#communityId = id; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILES:
    case plt.T_DATA.COMMUNITY_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render) {
    let profile = dba.Communities.get(this.#communityId);
    if (!profile) {
      return;
    }

    let pMain = new cmut.POverview();
    render.wrapPanel(pMain);

    let isEditor = this.#isEditor(profile);
    this.#fHeaderEditor.setEnableEdit(isEditor);

    let p = pMain.getHeaderPanel();
    this.#fHeaderEditor.setIconUrl(profile.getIconUrl());
    this.#fHeaderEditor.setImageUrl(profile.getImageUrl());
    this.#fHeaderEditor.attachRender(p);
    this.#fHeaderEditor.render();

    p = pMain.getNamePanel();
    if (isEditor) {
      this.#fNameEditor.setConfig({
        hint : "Community name",
        value : profile.getName(),
        isRequired : true
      });
      this.#fNameEditor.attachRender(p);
      this.#fNameEditor.render();
    } else {
      p.replaceContent(this.#renderName(profile.getName()));
    }

    p = pMain.getDescriptionPanel();
    if (isEditor) {
      this.#fDescriptionEditor.setConfig({
        hint : "Community description",
        value : profile.getDescription(),
        isRequired : false
      });
      this.#fDescriptionEditor.attachRender(p);
      this.#fDescriptionEditor.render();
    } else {
      p.replaceContent(this.#renderDescription(profile.getDescription()));
    }

    p = pMain.getCreatorPanel();
    this.#fCreator.setUserId(profile.getCreatorId());
    this.#fCreator.attachRender(p);
    this.#fCreator.render();

    p = pMain.getCaptainPanel();
    this.#fCaptain.setUserId(profile.getCaptainId());
    this.#fCaptain.attachRender(p);
    this.#fCaptain.render();

    p = pMain.getNMembersPanel();
    p.replaceContent(profile.getNMembers());

    if (dba.Account.isBetaTester()) {
      p = pMain.getNCoinsDescriptionPanel();
      p.replaceContent("Coins:");

      p = pMain.getNCoinsPanel();
      p.replaceContent(this.#renderNCoins(profile));

      p = pMain.getCoinBtnPanel();
      if (dba.Account.isInCommunity(this.#communityId)) {
        this.#btnCoinInfo.attachRender(p);
        this.#btnCoinInfo.render();
      }

      p = pMain.getBalanceDescriptionPanel();
      p.replaceContent("Cash:");

      p = pMain.getBalancePanel();
      p.replaceContent(profile.getCashBalance());

      p = pMain.getBalanceBtnPanel();
      if (dba.Account.isInCommunity(this.#communityId)) {
        this.#btnCashInfo.attachRender(p);
        this.#btnCashInfo.render();
      }
    }

    p = pMain.getNProposalsPanel();
    p.replaceContent(profile.getNProposals());

    if (dba.Account.isAuthenticated() && !dba.Account.getCommunityId() &&
        !dba.Account.isCommunityApplicationPending()) {
      p = pMain.getBtnJoinPanel();
      this.#btnJoin.attachRender(p);
      this.#btnJoin.render();
    }

    if (profile.getCreatorId() == dba.Account.getId()) {
      // Management actions
      p = pMain.getBtnProposePanel();
      this.#btnPropose.attachRender(p);
      this.#btnPropose.render();

      p = pMain.getBtnConfigPanel();
      this.#btnConfig.attachRender(p);
      this.#btnConfig.render();

      if (dba.WebConfig.isDevSite()) {
        p = pMain.getBtnIssueCoinPanel();
        this.#btnIssue.attachRender(p);
        this.#btnIssue.render();
      }
    }
  }

  #isEditor(profile) {
    let captainId = profile.getCaptainId();
    return dba.Account.getId() == captainId &&
           dba.WebConfig.getOwnerId() == captainId;
  }

  #renderName(name) { return name ? name : "Unnamed community"; }

  #renderDescription(description) {
    return description ? description : "No description";
  }

  #renderNCoins(profile) {
    let s = _CFT_COMMUNITY_OVERVIEW.N_COINS;
    s = s.replace("__N_TOTAL_COINS__", profile.getNTotalCoins());
    s = s.replace("__N_ACTIVE_COINS__", profile.getNActiveCoins());
    return s;
  }

  #onShowCoins() {
    let v = new ui.View();
    let f = new cmut.FvcCoinHistory();
    f.setCommunityId(this.#communityId);
    v.setContentFragment(f);
    this._delegate.onCommunityOverviewFragmentRequestShowView(this, v, "Coins");
  }

  #onShowFinance() {
    let v = new ui.View();
    let f = new cmut.FvcFinanceHistory();
    f.setCommunityId(this.#communityId);
    v.setContentFragment(f);
    this._delegate.onCommunityOverviewFragmentRequestShowView(this, v,
                                                              "Finance");
  }

  #onConfigClicked() {
    let v = new ui.View();
    let f = new cmut.FvcConfigEditor();
    f.setCommunityId(this.#communityId);
    f.setDelegate(this);
    v.setContentFragment(f);
    this._delegate.onCommunityOverviewFragmentRequestShowView(this, v,
                                                              "Config");
  }

  #onProposeClicked() {
    let v = new ui.View();
    v.setContentFragment(new cmut.FvcProposalEditor());
    this._delegate.onCommunityOverviewFragmentRequestShowView(this, v,
                                                              "Proposal");
  }

  #onApplyClicked() {
    let v = new ui.View();
    let fvc = new S.hr.FvcUserInput();
    let f = new ui.TextArea();
    f.setDelegate(this);
    f.setClassName("w100 h120px");
    f.setConfig({
      title : R.get("PROMPT_APPLY_COMMUNITY_MEMBERSHIP"),
      hint : "Message",
      value : "",
      isRequired : false
    });
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate : () => f.validate(),
      fcnOK : () => this.#applyMembership(f.getValue()),
    });
    v.setContentFragment(fvc);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
                                "Application message", false);
  }

  #onIssueCoinClicked() {
    let v = new ui.View();
    let fvc = new S.hr.FvcUserInput();
    let f = new ui.NumberInput();
    f.setConfig({
      title : R.get("CONFIRM_ISSUE_COINS"),
      min : 1,
      max : 100,
      step : 1,
      value : 10,
      unit : "M"
    });
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate : () => f.validate(),
      fcnOK : () => this.#onIssueCoin(parseInt(f.getValue())),
    });
    v.setContentFragment(fvc);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Input",
                                false);
  }

  #applyMembership(message) {
    let url = "/api/community/join";
    let fd = new FormData();
    fd.append("id", this.#communityId);
    fd.append("msg", message);
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onApplyRRR(d));
  }

  #onApplyRRR(data) {
    dba.Account.reset(data.profile);
    this._delegate.onNewProposalRequestAcceptedInOverviewFragment(this);
  }

  #onIssueCoin(nCoins) {
    let fd = new FormData();
    fd.append("total", nCoins);
    let url = "api/community/propose_issue_coins";
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onIssueCoinRRR(d));
  }

  #onIssueCoinRRR(data) {
    dba.Communities.reload(this.#communityId);
    this._delegate.onNewProposalRequestAcceptedInOverviewFragment(this);
  }

  #validateInput() {
    let b = true;
    b = b && this.#fNameEditor.validate();
    b = b && this.#fDescriptionEditor.validate();
    b = b && !this.#fHeaderEditor.isBusy();
    return b;
  }

  #asyncUpdateProfile() {
    let url = "/api/community/update";
    let fd = new FormData();
    fd.append('name', this.#fNameEditor.getValue());
    fd.append('description', this.#fDescriptionEditor.getValue());
    let info = this.#fHeaderEditor.getIconCacheFileInfo()
    fd.append('icon', JSON.stringify({
      "id" : info.id,
      "type" : info.mimeType,
      "cover_id" : info.coverId
    }));
    info = this.#fHeaderEditor.getImageCacheFileInfo();
    fd.append('image', JSON.stringify({
      "id" : info.id,
      "type" : info.mimeType,
      "cover_id" : info.coverId
    }));
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onUpdateProfileRRR(d));
  }

  #onUpdateProfileRRR(data) {
    dba.Communities.updateProfile(new dat.CommunityProfile(data.profile));
  }
};

cmut.FOverview = FOverview;
}(window.cmut = window.cmut || {}));
