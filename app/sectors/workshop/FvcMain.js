
export class FvcMain extends ui.FViewContentWithHeroBanner {
  static #T_PAGE = {
    OWNER_OPEN : Symbol(),
    OWNER_CLOSED: Symbol(),
    VISITOR: Symbol(),
  };
  #pageType;
  #fvcOwner;
  #fvcExplorer;
  #fMain;

  constructor() {
    super();
    this.#fvcExplorer = new wksp.FvcExplorer();
    this.#fvcExplorer.setDelegate(this);

    this.#fvcOwner = new wksp.FvcOwner();
    this.#fvcOwner.setDelegate(this);

    this.#fMain = new ui.FViewContentMux();
    this.#fMain.setDataSource(this);
    this.wrapContentFragment(this.#fMain);

    this.#resetContents();
  }

  getNTabNoticesForViewContentMuxFragment(fMux, v) {
    let n = 0;
    switch (v) {
    case "REPORT":
      n = dba.Notifications.getNWorkshopNotifications();
      break;
    default:
      break;
    }
    return n;
  }

  onOptionChangeInOptionsFragment(fMaster, value, isChecked) {
    if (isChecked && value == "MASTER") {
      this.#asyncOpenWorkshop();
    }
  }

  onWorkshopConfigFragmentRequestAddTeam(fConfig) {
    let v = new ui.View();
    v.setContentFragment(new wksp.FvcTeamEditor());
    this._owner.onFragmentRequestShowView(this, v, "Workshop team");
  }

  onWorkshopConfigFragmentRequestEditTeam(fConfig, teamId) {
    let v = new ui.View();
    let f = new wksp.FvcTeamEditor();
    f.setTeamId(teamId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Workshop team");
  }

  onWorkshopConfigFragmentRequestCloseWorkshop(fConfig) {
    this.#asyncCloseWorkshop();
  }

  onNewProjectPostedInProjectEditorContentFragment(fvcEditor) {
    this.#fvcOwner.reload();
  }

  onWorkshopOwnerFragmentRequestCreateProject(fOwner) {
    this.#asyncCreateProject();
  }

  onWorkshopExplorerFragmentRequestCreateProject(fExplorer) {
    this.#asyncCreateProject();
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PROFILE:
    case fwk.T_DATA.WEB_CONFIG:
      this.#resetContents();
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  #getPageType() {
    if (dba.Account.isWebOwner()) {
      if (dba.Workshop.isOpen()) {
        return this.constructor.#T_PAGE.OWNER_OPEN;
      } else {
        return this.constructor.#T_PAGE.OWNER_CLOSED;
      }
    } else {
      return this.constructor.#T_PAGE.VISITOR;
    }
  }

  #resetContents() {
    let t = this.#getPageType();
    if (t == this.#pageType) {
      return;
    }

    this.#pageType = t;

    switch (t) {
    case this.constructor.#T_PAGE.OWNER_OPEN:
      this.#resetAsOwnerOpen();
      break;
    case this.constructor.#T_PAGE.OWNER_CLOSED:
      this.#resetAsOwnerClosed();
      break;
    default:
      this.#resetAsVisitor();
      break;
    }
  }

  #resetAsVisitor() {
    this.#fMain.clearContents();
    this.setHeroBannerFragment(null);

    this.#fvcOwner.setOwnerId(dba.WebConfig.getOwnerId());
    this.#fMain.addTab(
        {name : R.t("Projects"), value : "OWNER", icon : C.ICON.PROJECT},
        this.#fvcOwner);
    this.#fMain.switchTo("OWNER");
  }

  #resetAsOwnerClosed() {
    this.#fMain.clearContents();

    let ff = new ui.OptionSwitch();
    ff.addOption(R.get("OPEN_WORKSHOP"), "MASTER");
    ff.setDelegate(this);
    this.setHeroBannerFragment(ff);

    this.#fMain.addTab(
        {name : R.t("Activities"), value : "NEWS", icon : C.ICON.EXPLORER},
        this.#fvcExplorer);
    this.#fMain.switchTo("NEWS");
  }

  #resetAsOwnerOpen() {
    this.#fMain.clearContents();
    this.setHeroBannerFragment(null);

    this.#fMain.addTab(
        {name : R.t("Activities"), value : "NEWS", icon : C.ICON.EXPLORER},
        this.#fvcExplorer);

    this.#fvcOwner.setOwnerId(dba.WebConfig.getOwnerId());
    this.#fMain.addTab(
        {name : R.t("Mine"), value : "OWNER", icon : C.ICON.SMILEY},
        this.#fvcOwner);

    let ff = new wksp.FvcConfig();
    ff.setDelegate(this);
    this.#fMain.addTab(
        {name : R.t("Config"), value : "CONFIG", icon : C.ICON.CONFIG}, ff);

    ff = new wksp.FvcReport();
    ff.setDelegate(this);
    this.#fMain.addTab(
        {name : R.t("Report"), value : "REPORT", icon : C.ICON.REPORT}, ff);

    this.#fMain.switchTo("NEWS");
  }

  #showDraftEditor(project) {
    project.setIsDraft();
    let v = new ui.View();
    let f = new wksp.FvcProjectEditor();
    f.setDelegate(this);
    f.setProject(project);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(v, "Project editor");
  }

  #asyncCreateProject() {
    let url = "api/workshop/new_project";
    plt.Api.asyncFragmentCall(this, url).then(d => this.#onDraftProjectRRR(d));
  }

  #onDraftProjectRRR(data) {
    this.#showDraftEditor(new dat.Project(data.project));
  }

  #asyncOpenWorkshop() {
    let url = "api/workshop/request_open";
    plt.Api.asyncFragmentCall(this, url).then(d => this.#onOpenWorkshopRRR(d));
  }

  #onOpenWorkshopRRR(data) { dba.WebConfig.setWorkshopOpen(true); }

  #asyncCloseWorkshop() {
    let url = "api/workshop/request_close";
    plt.Api.asyncFragmentCall(this, url).then(d => this.#onCloseWorkshopRRR(d));
  }

  #onCloseWorkshopRRR(data) { dba.WebConfig.reset(data.web_config); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.FvcMain = FvcMain;
}
