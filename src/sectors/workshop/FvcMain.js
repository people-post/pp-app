import { FViewContentWithHeroBanner } from '../../lib/ui/controllers/fragments/FViewContentWithHeroBanner.js';
import { FvcExplorer } from './FvcExplorer.js';
import { FvcOwner } from './FvcOwner.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ID, MAX } from '../../common/constants/Constants.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { T_DATA } from '../../common/plt/Events.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';
import { Project } from '../../common/datatypes/Project.js';
import { FvcTeamEditor } from './FvcTeamEditor.js';
import { FvcConfig } from './FvcConfig.js';
import { FvcReport } from './FvcReport.js';
import { FvcProjectEditor } from './FvcProjectEditor.js';
import { T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { Api } from '../../common/plt/Api.js';

export class FvcMain extends FViewContentWithHeroBanner {
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
    this.#fvcExplorer = new FvcExplorer();
    this.#fvcExplorer.setDelegate(this);

    this.#fvcOwner = new FvcOwner();
    this.#fvcOwner.setDelegate(this);

    this.#fMain = new FViewContentMux();
    this.#fMain.setDataSource(this);
    this.wrapContentFragment(this.#fMain);

    this.#resetContents();
  }

  getNTabNoticesForViewContentMuxFragment(fMux, v) {
    let n = 0;
    switch (v) {
    case "REPORT":
      n = Notifications.getNWorkshopNotifications();
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
    let v = new View();
    v.setContentFragment(new FvcTeamEditor());
    this._owner.onFragmentRequestShowView(this, v, "Workshop team");
  }

  onWorkshopConfigFragmentRequestEditTeam(fConfig, teamId) {
    let v = new View();
    let f = new FvcTeamEditor();
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
    case T_DATA.USER_PROFILE:
    case FwkT_DATA.WEB_CONFIG:
      this.#resetContents();
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  #getPageType() {
    if (window.dba.Account.isWebOwner()) {
      if (Workshop.isOpen()) {
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

    this.#fvcOwner.setOwnerId(WebConfig.getOwnerId());
    this.#fMain.addTab(
        {name : R.t("Projects"), value : "OWNER", icon : ICON.PROJECT},
        this.#fvcOwner);
    this.#fMain.switchTo("OWNER");
  }

  #resetAsOwnerClosed() {
    this.#fMain.clearContents();

    let ff = new OptionSwitch();
    ff.addOption(R.get("OPEN_WORKSHOP"), "MASTER");
    ff.setDelegate(this);
    this.setHeroBannerFragment(ff);

    this.#fMain.addTab(
        {name : R.t("Activities"), value : "NEWS", icon : ICON.EXPLORER},
        this.#fvcExplorer);
    this.#fMain.switchTo("NEWS");
  }

  #resetAsOwnerOpen() {
    this.#fMain.clearContents();
    this.setHeroBannerFragment(null);

    this.#fMain.addTab(
        {name : R.t("Activities"), value : "NEWS", icon : ICON.EXPLORER},
        this.#fvcExplorer);

    this.#fvcOwner.setOwnerId(WebConfig.getOwnerId());
    this.#fMain.addTab(
        {name : R.t("Mine"), value : "OWNER", icon : ICON.SMILEY},
        this.#fvcOwner);

    let ff = new FvcConfig();
    ff.setDelegate(this);
    this.#fMain.addTab(
        {name : R.t("Config"), value : "CONFIG", icon : ICON.CONFIG}, ff);

    ff = new FvcReport();
    ff.setDelegate(this);
    this.#fMain.addTab(
        {name : R.t("Report"), value : "REPORT", icon : ICON.REPORT}, ff);

    this.#fMain.switchTo("NEWS");
  }

  #showDraftEditor(project) {
    project.setIsDraft();
    let v = new View();
    let f = new FvcProjectEditor();
    f.setDelegate(this);
    f.setProject(project);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(v, "Project editor");
  }

  #asyncCreateProject() {
    let url = "api/workshop/new_project";
    Api.asFragmentCall(this, url).then(d => this.#onDraftProjectRRR(d));
  }

  #onDraftProjectRRR(data) {
    this.#showDraftEditor(new Project(data.project));
  }

  #asyncOpenWorkshop() {
    let url = "api/workshop/request_open";
    Api.asFragmentCall(this, url).then(d => this.#onOpenWorkshopRRR(d));
  }

  #onOpenWorkshopRRR(data) { WebConfig.setWorkshopOpen(true); }

  #asyncCloseWorkshop() {
    let url = "api/workshop/request_close";
    Api.asFragmentCall(this, url).then(d => this.#onCloseWorkshopRRR(d));
  }

  #onCloseWorkshopRRR(data) { WebConfig.reset(data.web_config); }
};
