export const CF_PROJECT_STAGE = {
  ON_CLICK : Symbol(),
};

class FProjectStage extends ui.Fragment {
  static LTC_MID = "LTC_MID";
  static LTR_COMPACT = "LTR_COMPACT";
  static LTR_MID = "LTR_MID";
  static LT_FULL = "FULL";
  static LT_MENU_ITEM = "LT_MENU_ITEM";

  constructor() {
    super();
    this._fOptions = new ui.OptionContextButton();
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
    case dat.ProjectStage.ACTIONS.CLOSE.type:
      this.#onMarkDone();
      break;
    case dat.ProjectStage.ACTIONS.UNSET.type:
      this.#onUnsetStatus();
      break;
    case dat.ProjectStage.ACTIONS.DELETE.type:
      this.#onDelete();
      break;
    case dat.ProjectStage.ACTIONS.CONNECT.type:
      this.#onConnect();
      break;
    case dat.ProjectStage.ACTIONS.PREPEND.type:
      this.#onPrepend();
      break;
    case dat.ProjectStage.ACTIONS.APPEND.type:
      this.#onAppend();
      break;
    default:
      break;
    }
  }

  action(type, ...args) {
    switch (type) {
    case wksp.CF_PROJECT_STAGE.ON_CLICK:
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
                     "javascript:G.action(wksp.CF_PROJECT_STAGE.ON_CLICK)");
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
      ppp = new ui.SectionPanel("Description");
      pp.wrapPanel(ppp);
      ppp.replaceContent(this._stage.getDescription());
    }

    pp = p.getCommentPanel();
    if (pp && this._stage.getComment()) {
      ppp = new ui.SectionPanel("Comment");
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
      p = new wksp.PProjectStageInfoCell();
      break;
    case this.constructor.LTR_COMPACT:
      // Currently for quick action bar in project view
      p = new wksp.PProjectStageInfoCompact();
      break;
    case this.constructor.LT_MENU_ITEM:
      // Currently for config connections for stage
      p = new wksp.PProjectStageMenuItem();
      break;
    case this.constructor.LTR_MID:
      // Currently for displaying stage info in activity
      p = new wksp.PProjectStageInfoRow();
      break;
    case this.constructor.LT_FULL:
      // Currently for stage view
      p = new wksp.PProjectStage();
      break;
    default:
      p = new wksp.PProjectStageInfoRow();
      break;
    }
    return p;
  }

  #getActions() {
    let project = dba.Workshop.getProject(this._stage.getProjectId());
    if (project) {
      return project.getActionsForUserInStage(dba.Account.getId(), this._stage);
    }
    return [];
  }

  #onMarkDone() {
    let v = new ui.View();
    let fvc = new S.hr.FvcUserInput();
    let f = new ui.TextInput();
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
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Comments",
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
    let v = new ui.View();
    let f = new wksp.FvcProjectStageConnection();
    f.setStage(this._stage);
    v.setContentFragment(f);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
                                "Stage connection", true);
  }

  #onPrepend() {
    let v = new ui.View();
    let f = new wksp.FvcCreateProjectStageChoice();
    f.setProjectId(this._stage.getProjectId());
    f.setBeforeStage(this._stage.getId());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Add stage");
  }

  #onAppend() {
    let v = new ui.View();
    let f = new wksp.FvcCreateProjectStageChoice();
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
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncMarkDone(comment) {
    let fd = new FormData();
    fd.append("project_id", this._stage.getProjectId());
    fd.append("stage_id", this._stage.getId());
    fd.append("comment", comment);
    let url = "api/workshop/set_stage_status";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncUnsetSatus() {
    let fd = new FormData();
    fd.append("project_id", this._stage.getProjectId());
    fd.append("stage_id", this._stage.getId());
    let url = "api/workshop/unset_stage_status";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #onProjectDataReceived(data) {
    dba.Workshop.updateProject(new dat.Project(data.project));
  }
};

wksp.FProjectStage = FProjectStage;
}(window.wksp = window.wksp || {}));

// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.CF_PROJECT_STAGE = CF_PROJECT_STAGE;
}