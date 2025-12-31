export const CF_PROJECT_STAGE = {
  ON_CLICK : Symbol(),
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { OptionContextButton } from '../../lib/ui/controllers/fragments/OptionContextButton.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { ProjectStage } from '../../common/datatypes/ProjectStage.js';
import { Project } from '../../common/datatypes/Project.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { Account } from '../../common/dba/Account.js';
import { R } from '../../common/constants/R.js';
import { api } from '../../common/plt/Api.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FvcUserInput } from '../../common/hr/FvcUserInput.js';
import { FvcProjectStageConnection } from './FvcProjectStageConnection.js';
import { FvcCreateProjectStageChoice } from './FvcCreateProjectStageChoice.js';
import { PProjectStageInfoCell } from './PProjectStageInfoCell.js';
import { PProjectStageInfoCompact } from './PProjectStageInfoCompact.js';
import { PProjectStageMenuItem } from './PProjectStageMenuItem.js';
import { PProjectStageInfoRow } from './PProjectStageInfoRow.js';
import { PProjectStage } from './PProjectStage.js';

export class FProjectStage extends Fragment {
  static LTC_MID = "LTC_MID";
  static LTR_COMPACT = "LTR_COMPACT";
  static LTR_MID = "LTR_MID";
  static LT_FULL = "FULL";
  static LT_MENU_ITEM = "LT_MENU_ITEM";

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

  isSelected() { return this._isSelected; }
  getStage() { return this._stage; }

  setStage(stage) { this._stage = stage; }
  setLayoutType(layoutType) { this._layoutType = layoutType; }
  setEnableActions(b) { this._isActionsEnabled = b; }
  setSelected(b) { this._isSelected = b; }
  setEnabled(b) { this._isEnabled = b; }

  onOptionClickedInContextButtonFragment(fBtn, value) {
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

  action(type, ...args) {
    switch (type) {
    case CF_PROJECT_STAGE.ON_CLICK:
      this._delegate.onClickInProjectStageFragment(this);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = this.#createPanel();
    if (this._isEnabled) {
      p.setClassName("clickable");
      p.setAttribute("onclick",
                     "javascript:G.action(CF_PROJECT_STAGE.ON_CLICK)");
    }
    render.wrapPanel(p);

    p.setThemeForState(this._stage.getState(), this._stage.getStatus());
    p.setEnabled(this._isEnabled);
    p.setSelected(this._isSelected);

    let ppp;
    let pp = p.getNamePanel();
    pp.replaceContent(this._stage.getName());

    pp = p.getDescriptionPanel();
    if (pp && this._stage.getDescription()) {
      ppp = new SectionPanel("Description");
      pp.wrapPanel(ppp);
      ppp.replaceContent(this._stage.getDescription());
    }

    pp = p.getCommentPanel();
    if (pp && this._stage.getComment()) {
      ppp = new SectionPanel("Comment");
      pp.wrapPanel(ppp);
      ppp.replaceContent(this._stage.getComment());
    }

    if (this._isEnabled && this._isActionsEnabled) {
      let actions = this.#getActions();
      if (actions.length) {
        pp = p.getOptionBtnPanel();
        this._fOptions.clearOptions();
        this._fOptions.setTargetName(this._stage.getName());
        for (let a of actions) {
          this._fOptions.addOption(a.name, a.type);
        }
        this._fOptions.attachRender(pp);
        this._fOptions.render();
      }
    }
  }

  #createPanel() {
    let p;
    switch (this._layoutType) {
    case this.constructor.LTC_MID:
      // Currently for process element in flow chart
      p = new PProjectStageInfoCell();
      break;
    case this.constructor.LTR_COMPACT:
      // Currently for quick action bar in project view
      p = new PProjectStageInfoCompact();
      break;
    case this.constructor.LT_MENU_ITEM:
      // Currently for config connections for stage
      p = new PProjectStageMenuItem();
      break;
    case this.constructor.LTR_MID:
      // Currently for displaying stage info in activity
      p = new PProjectStageInfoRow();
      break;
    case this.constructor.LT_FULL:
      // Currently for stage view
      p = new PProjectStage();
      break;
    default:
      p = new PProjectStageInfoRow();
      break;
    }
    return p;
  }

  #getActions() {
    let project = Workshop.getProject(this._stage.getProjectId());
    if (project) {
      return project.getActionsForUserInStage(Account.getId(), this._stage);
    }
    return [];
  }

  #onMarkDone() {
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

  #onUnsetStatus() {
    this._confirmDangerousOperation(R.get("CONFIRM_UNSET_STAGE"),
                                    () => this.#asyncUnsetSatus());
  }

  #onDelete() {
    this._confirmDangerousOperation(R.get("CONFIRM_DELETE_STAGE"),
                                    () => this.#asyncDeleteStage());
  }

  #onConnect() {
    let v = new View();
    let f = new FvcProjectStageConnection();
    f.setStage(this._stage);
    v.setContentFragment(f);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                "Stage connection", true);
  }

  #onPrepend() {
    let v = new View();
    let f = new FvcCreateProjectStageChoice();
    f.setProjectId(this._stage.getProjectId());
    f.setBeforeStage(this._stage.getId());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Add stage");
  }

  #onAppend() {
    let v = new View();
    let f = new FvcCreateProjectStageChoice();
    f.setProjectId(this._stage.getProjectId());
    f.setAfterStage(this._stage.getId());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Add stage");
  }

  #asyncDeleteStage() {
    let url = "api/workshop/remove_project_stage";
    let fd = new FormData();
    fd.append("project_id", this._stage.getProjectId());
    fd.append("stage_id", this._stage.getId());
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncMarkDone(comment) {
    let fd = new FormData();
    fd.append("project_id", this._stage.getProjectId());
    fd.append("stage_id", this._stage.getId());
    fd.append("comment", comment);
    let url = "api/workshop/set_stage_status";
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncUnsetSatus() {
    let fd = new FormData();
    fd.append("project_id", this._stage.getProjectId());
    fd.append("stage_id", this._stage.getId());
    let url = "api/workshop/unset_stage_status";
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #onProjectDataReceived(data) {
    Workshop.updateProject(new Project(data.project));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.CF_PROJECT_STAGE = CF_PROJECT_STAGE;
}