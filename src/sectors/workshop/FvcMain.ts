import { FViewContentWithHeroBanner } from '../../lib/ui/controllers/fragments/FViewContentWithHeroBanner.js';
import { FvcExplorer } from './FvcExplorer.js';
import { FvcOwner } from './FvcOwner.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { T_DATA } from '../../common/plt/Events.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';
import { Project } from '../../common/datatypes/Project.js';
import { FvcTeamEditor } from './FvcTeamEditor.js';
import { FvcConfig, FvcConfigDelegate } from './FvcConfig.js';
import { FvcReport } from './FvcReport.js';
import { FvcProjectEditor } from './FvcProjectEditor.js';
import { T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { Api } from '../../common/plt/Api.js';

interface FvcMainDelegate {
  onWorkshopConfigFragmentRequestAddTeam(f: FvcConfig): void;
  onWorkshopConfigFragmentRequestEditTeam(f: FvcConfig, teamId: string): void;
  onWorkshopConfigFragmentRequestCloseWorkshop(f: FvcConfig): void;
  onNewProjectPostedInProjectEditorContentFragment(f: FvcProjectEditor): void;
  onWorkshopOwnerFragmentRequestCreateProject(f: FvcOwner): void;
  onWorkshopExplorerFragmentRequestCreateProject(f: FvcExplorer): void;
}

export class FvcMain extends FViewContentWithHeroBanner implements FvcConfigDelegate {
  private static readonly T_PAGE = {
    OWNER_OPEN : Symbol(),
    OWNER_CLOSED: Symbol(),
    VISITOR: Symbol(),
  };
  private _pageType: symbol | null = null;
  private _fvcOwner: FvcOwner;
  private _fvcExplorer: FvcExplorer;
  private _fMain: FViewContentMux;

  constructor() {
    super();
    this._fvcExplorer = new FvcExplorer();
    this._fvcExplorer.setDelegate(this);

    this._fvcOwner = new FvcOwner();
    this._fvcOwner.setDelegate(this);

    this._fMain = new FViewContentMux();
    this._fMain.setDataSource(this);
    this.wrapContentFragment(this._fMain);

    this.#resetContents();
  }

  getNTabNoticesForViewContentMuxFragment(_fMux: FViewContentMux, v: string): number {
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

  onOptionChangeInOptionsFragment(_fMaster: OptionSwitch, value: string, isChecked: boolean): void {
    if (isChecked && value == "MASTER") {
      this.#asyncOpenWorkshop();
    }
  }

  onWorkshopConfigFragmentRequestAddTeam(_fConfig: FvcConfig): void {
    let v = new View();
    v.setContentFragment(new FvcTeamEditor());
    this._owner.onFragmentRequestShowView(this, v, "Workshop team");
  }

  onWorkshopConfigFragmentRequestEditTeam(_fConfig: FvcConfig, teamId: string): void {
    let v = new View();
    let f = new FvcTeamEditor();
    f.setTeamId(teamId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Workshop team");
  }

  onWorkshopConfigFragmentRequestCloseWorkshop(_fConfig: FvcConfig): void {
    this.#asyncCloseWorkshop();
  }

  onNewProjectPostedInProjectEditorContentFragment(_fvcEditor: FvcProjectEditor): void {
    this._fvcOwner.reload();
  }

  onWorkshopOwnerFragmentRequestCreateProject(_fOwner: FvcOwner): void {
    this.#asyncCreateProject();
  }

  onWorkshopExplorerFragmentRequestCreateProject(_fExplorer: FvcExplorer): void {
    this.#asyncCreateProject();
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
    case FwkT_DATA.WEB_CONFIG:
      this.#resetContents();
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  #getPageType(): symbol {
    if (window.dba?.Account?.isWebOwner?.()) {
      if (Workshop.isOpen()) {
        return FvcMain.T_PAGE.OWNER_OPEN;
      } else {
        return FvcMain.T_PAGE.OWNER_CLOSED;
      }
    } else {
      return FvcMain.T_PAGE.VISITOR;
    }
  }

  #resetContents(): void {
    let t = this.#getPageType();
    if (t == this._pageType) {
      return;
    }

    this._pageType = t;

    switch (t) {
    case FvcMain.T_PAGE.OWNER_OPEN:
      this.#resetAsOwnerOpen();
      break;
    case FvcMain.T_PAGE.OWNER_CLOSED:
      this.#resetAsOwnerClosed();
      break;
    default:
      this.#resetAsVisitor();
      break;
    }
  }

  #resetAsVisitor(): void {
    this._fMain.clearContents();
    this.setHeroBannerFragment(null);

    this._fvcOwner.setOwnerId(WebConfig.getOwnerId());
    this._fMain.addTab(
        {name : R.t("Projects"), value : "OWNER", icon : ICON.PROJECT},
        this._fvcOwner);
    this._fMain.switchTo("OWNER");
  }

  #resetAsOwnerClosed(): void {
    this._fMain.clearContents();

    let ff = new OptionSwitch();
    ff.addOption(R.get("OPEN_WORKSHOP"), "MASTER");
    ff.setDelegate(this);
    this.setHeroBannerFragment(ff);

    this._fMain.addTab(
        {name : R.t("Activities"), value : "NEWS", icon : ICON.EXPLORER},
        this._fvcExplorer);
    this._fMain.switchTo("NEWS");
  }

  #resetAsOwnerOpen(): void {
    this._fMain.clearContents();
    this.setHeroBannerFragment(null);

    this._fMain.addTab(
        {name : R.t("Activities"), value : "NEWS", icon : ICON.EXPLORER},
        this._fvcExplorer);

    this._fvcOwner.setOwnerId(WebConfig.getOwnerId());
    this._fMain.addTab(
        {name : R.t("Mine"), value : "OWNER", icon : ICON.SMILEY},
        this._fvcOwner);

    let ff = new FvcConfig();
    ff.setDelegate(this);
    this._fMain.addTab(
        {name : R.t("Config"), value : "CONFIG", icon : ICON.CONFIG}, ff);

    ff = new FvcReport();
    ff.setDelegate(this);
    this._fMain.addTab(
        {name : R.t("Report"), value : "REPORT", icon : ICON.REPORT}, ff);

    this._fMain.switchTo("NEWS");
  }

  #showDraftEditor(project: Project): void {
    project.setIsDraft();
    let v = new View();
    let f = new FvcProjectEditor();
    f.setDelegate(this);
    f.setProject(project);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Project editor");
  }

  #asyncCreateProject(): void {
    let url = "api/workshop/new_project";
    Api.asFragmentCall(this, url).then((d: any) => this.#onDraftProjectRRR(d));
  }

  #onDraftProjectRRR(data: any): void {
    this.#showDraftEditor(new Project(data.project));
  }

  #asyncOpenWorkshop(): void {
    let url = "api/workshop/request_open";
    Api.asFragmentCall(this, url).then((d: any) => this.#onOpenWorkshopRRR(d));
  }

  #onOpenWorkshopRRR(data: any): void { WebConfig.setWorkshopOpen(true); }

  #asyncCloseWorkshop(): void {
    let url = "api/workshop/request_close";
    Api.asFragmentCall(this, url).then((d: any) => this.#onCloseWorkshopRRR(d));
  }

  #onCloseWorkshopRRR(data: any): void { WebConfig.reset(data.web_config); }
}
