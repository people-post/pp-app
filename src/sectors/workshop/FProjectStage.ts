import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { OptionContextButton, IOptionContextButtonDelegate } from '../../lib/ui/controllers/fragments/OptionContextButton.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { ProjectStage } from '../../common/datatypes/ProjectStage.js';
import { Project } from '../../common/datatypes/Project.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { R } from '../../common/constants/R.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FvcUserInput } from '../../common/hr/FvcUserInput.js';
import { FvcProjectStageConnection } from './FvcProjectStageConnection.js';
import { FvcCreateProjectStageChoice } from './FvcCreateProjectStageChoice.js';
import { PProjectStageInfoCell } from './PProjectStageInfoCell.js';
import { PProjectStageInfoCompact } from './PProjectStageInfoCompact.js';
import { PProjectStageMenuItem } from './PProjectStageMenuItem.js';
import { PProjectStageInfoRow } from './PProjectStageInfoRow.js';
import { PProjectStage } from './PProjectStage.js';
import { Api } from '../../common/plt/Api.js';
import type { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import type { PProjectStageBase } from './PProjectStageBase.js';
import { Account } from '../../common/dba/Account.js';
import { ProjectData } from '../../types/backend2.js';

const CF_PROJECT_STAGE = {
  ON_CLICK: "CF_PROJECT_STAGE_1",
} as const;

export interface FProjectStageDelegate {
  onClickInProjectStageFragment(f: FProjectStage): void;
}

interface ApiProjectDataResponse {
  project: ProjectData;
}

interface ProjectStageAction {
  name: string;
  type: string;
}

export class FProjectStage extends Fragment implements IOptionContextButtonDelegate {
  static LTC_MID = "LTC_MID";
  static LTR_COMPACT = "LTR_COMPACT";
  static LTR_MID = "LTR_MID";
  static LT_FULL = "FULL";
  static LT_MENU_ITEM = "LT_MENU_ITEM";

  protected _fOptions: OptionContextButton;
  protected _stage: ProjectStage | null;
  protected _layoutType: string | null;
  protected _isActionsEnabled: boolean;
  protected _isSelected: boolean;
  protected _isEnabled: boolean;

  constructor() {
    super();
    this._fOptions = new OptionContextButton();
    this._fOptions.setDelegate(this);
    this.setChild("options", this._fOptions);

    this._stage = null;
    this._layoutType = null;
    this._isActionsEnabled = true;
    this._isSelected = false;
    this._isEnabled = true;
  }

  isSelected(): boolean { return this._isSelected; }
  getStage(): ProjectStage | null { return this._stage; }

  setStage(stage: ProjectStage | null): void { this._stage = stage; }
  setLayoutType(layoutType: string | null): void { this._layoutType = layoutType; }
  setEnableActions(b: boolean): void { this._isActionsEnabled = b; }
  setSelected(b: boolean): void { this._isSelected = b; }
  setEnabled(b: boolean): void { this._isEnabled = b; }

  onOptionClickedInContextButtonFragment(_fBtn: OptionContextButton, value: string): void {
    switch (value) {
    case ProjectStage.ACTIONS.CLOSE.type:
      this.#onMarkDone();
      break;
    case ProjectStage.ACTIONS.UNSET.type:
      this.#onUnsetStatus();
      break;
    case ProjectStage.ACTIONS.DELETE.type:
      this.#onDelete();
      break;
    case ProjectStage.ACTIONS.CONNECT.type:
      this.#onConnect();
      break;
    case ProjectStage.ACTIONS.PREPEND.type:
      this.#onPrepend();
      break;
    case ProjectStage.ACTIONS.APPEND.type:
      this.#onAppend();
      break;
    default:
      break;
    }
  }

  action(type: symbol | string, ...args: unknown[]): void {
    switch (type) {
    case CF_PROJECT_STAGE.ON_CLICK:
      this.getDelegate<FProjectStageDelegate>()?.onClickInProjectStageFragment(this);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._stage) {
      return;
    }
    let p = this.#createPanel();
    if (this._isEnabled) {
      p.setClassName("tw:cursor-pointer");
      p.setAttribute("data-pp-action", CF_PROJECT_STAGE.ON_CLICK);
    }
    render.wrapPanel(p);

    p.setThemeForState(this._stage.getState(), this._stage.getStatus());
    p.setEnabled(this._isEnabled);
    p.setSelected(this._isSelected);

    let ppp: SectionPanel | null;
    let pName = p.getNamePanel();
    if (pName) {
      pName.replaceContent(this._stage.getName());
    }

    let pDescription = p.getDescriptionPanel();
    if (pDescription && this._stage.getDescription()) {
      ppp = new SectionPanel("Description");
      pDescription.wrapPanel(ppp);
      ppp.replaceContent(this._stage.getDescription());
    }

    let pComment = p.getCommentPanel();
    if (pComment && this._stage.getComment()) {
      ppp = new SectionPanel("Comment");
      pComment.wrapPanel(ppp);
      ppp.replaceContent(this._stage.getComment());
    }

    if (this._isEnabled && this._isActionsEnabled) {
      let actions = this.#getActions();
      if (actions.length) {
        let pOption = p.getOptionBtnPanel();
        if (pOption) {
          this._fOptions.clearOptions();
          this._fOptions.setTargetName(this._stage.getName());
          for (let a of actions) {
            this._fOptions.addOption(a.name, a.type);
          }
          this._fOptions.attachRender(pOption);
          this._fOptions.render();
        }
      }
    }
  }

  #createPanel(): PProjectStageBase {
    let p: PProjectStageBase;
    switch (this._layoutType) {
    case FProjectStage.LTC_MID:
      // Currently for process element in flow chart
      p = new PProjectStageInfoCell();
      break;
    case FProjectStage.LTR_COMPACT:
      // Currently for quick action bar in project view
      p = new PProjectStageInfoCompact();
      break;
    case FProjectStage.LT_MENU_ITEM:
      // Currently for config connections for stage
      p = new PProjectStageMenuItem();
      break;
    case FProjectStage.LTR_MID:
      // Currently for displaying stage info in activity
      p = new PProjectStageInfoRow();
      break;
    case FProjectStage.LT_FULL:
      // Currently for stage view
      p = new PProjectStage();
      break;
    default:
      p = new PProjectStageInfoRow();
      break;
    }
    return p;
  }

  #getActions(): ProjectStageAction[] {
    if (!this._stage) {
      return [];
    }
    let project = Workshop.getProject(this._stage.getProjectId());
    if (project) {
      return project.getActionsForUserInStage(Account.getId(), this._stage);
    }
    return [];
  }

  #onMarkDone(): void {
    let v = new View();
    let fvc = new FvcUserInput();
    let f = new TextInput();
    f.setConfig({
      title : R.get("CONFIRM_MARK_STAGE_DONE"),
      hint : "Comments",
      value : "",
      isRequired : false
    });
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate : () => f.validate(),
      fcnOK : () => this.#asyncMarkDone(f.getValue()),
    });
    v.setContentFragment(fvc);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Comments",
                                false);
  }

  #onUnsetStatus(): void {
    this._confirmDangerousOperation(R.get("CONFIRM_UNSET_STAGE"),
                                    () => this.#asyncUnsetSatus());
  }

  #onDelete(): void {
    this._confirmDangerousOperation(R.get("CONFIRM_DELETE_STAGE"),
                                    () => this.#asyncDeleteStage());
  }

  #onConnect(): void {
    if (!this._stage) {
      return;
    }
    let v = new View();
    let f = new FvcProjectStageConnection();
    f.setStage(this._stage);
    v.setContentFragment(f);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                "Stage connection", true);
  }

  #onPrepend(): void {
    if (!this._stage) {
      return;
    }
    let v = new View();
    let f = new FvcCreateProjectStageChoice();
    f.setProjectId(this._stage.getProjectId());
    f.setBeforeStage(this._stage.getId());
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Add stage");
  }

  #onAppend(): void {
    if (!this._stage) {
      return;
    }
    let v = new View();
    let f = new FvcCreateProjectStageChoice();
    f.setProjectId(this._stage.getProjectId());
    f.setAfterStage(this._stage.getId());
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Add stage");
  }

  #asyncDeleteStage(): void {
    if (!this._stage) {
      return;
    }
    let url = "api/workshop/remove_project_stage";
    let fd = new FormData();
    fd.append("project_id", this._stage.getProjectId());
    fd.append("stage_id", this._stage.getId());
    Api.asFragmentPost<ApiProjectDataResponse>(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncMarkDone(comment: string): void {
    if (!this._stage) {
      return;
    }
    let fd = new FormData();
    fd.append("project_id", this._stage.getProjectId());
    fd.append("stage_id", this._stage.getId());
    fd.append("comment", comment);
    let url = "api/workshop/set_stage_status";
    Api.asFragmentPost<ApiProjectDataResponse>(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncUnsetSatus(): void {
    if (!this._stage) {
      return;
    }
    let fd = new FormData();
    fd.append("project_id", this._stage.getProjectId());
    fd.append("stage_id", this._stage.getId());
    let url = "api/workshop/unset_stage_status";
    Api.asFragmentPost<ApiProjectDataResponse>(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #onProjectDataReceived(data: ApiProjectDataResponse): void {
    Workshop.updateProject(new Project(data.project));
  }
};
