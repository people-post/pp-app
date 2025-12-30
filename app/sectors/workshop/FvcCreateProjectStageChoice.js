
class FvcCreateProjectStageChoice extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fBtnSimple = new ui.Button();
    this._fBtnSimple.setName("Simple stage");
    this._fBtnSimple.setValue(dat.ProjectStage.TYPES.SIMPLE);
    this._fBtnSimple.setDelegate(this);
    this.setChild("btnSimple", this._fBtnSimple);

    this._fBtnRef = new ui.Button();
    this._fBtnRef.setName("Link to another stage");
    this._fBtnRef.setValue(dat.ProjectStage.TYPES.REFERENCE);
    this._fBtnRef.setDelegate(this);
    this._fBtnRef.setEnabled(false);
    this.setChild("btnRef", this._fBtnRef);

    this._fBtnCheckin = new ui.Button();
    this._fBtnCheckin.setName("Check in stage");
    this._fBtnCheckin.setValue(dat.ProjectStage.TYPES.CHECK_IN);
    this._fBtnCheckin.setDelegate(this);
    this._fBtnCheckin.setEnabled(false);
    this.setChild("btnCheckin", this._fBtnCheckin);

    this._fBtnSwitch = new ui.Button();
    this._fBtnSwitch.setName("Branch switch stage");
    this._fBtnSwitch.setValue(dat.ProjectStage.TYPES.SWITCH);
    this._fBtnSwitch.setDelegate(this);
    this._fBtnSwitch.setEnabled(false);
    this.setChild("btnSwitch", this._fBtnSwitch);

    this._projectId = null;
    this._stageId = null;
    this._position = null;
  }

  onSimpleButtonClicked(fBtn) { this.#asyncAddNewStage(fBtn.getValue()); }

  setProjectId(id) { this._projectId = id; }
  setBeforeStage(stageId) {
    this._stageId = stageId;
    this._position = "BEFORE";
  }
  setAfterStage(stageId) {
    this._stageId = stageId;
    this._position = "AFTER";
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    p.pushSpace(1);

    for (let f of [this._fBtnSimple, this._fBtnRef, this._fBtnCheckin,
                   this._fBtnSwitch]) {
      let pp = new ui.PanelWrapper();
      p.pushPanel(pp);
      f.attachRender(pp);
      f.render();
      p.pushSpace(1);
    }
  }

  #asyncAddNewStage(type) {
    let url = "api/workshop/add_project_stage";
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("type", type);
    switch (this._position) {
    case "AFTER":
      fd.append("after_stage_id", this._stageId);
      break;
    case "BEFORE":
      fd.append("before_stage_id", this._stageId);
      break;
    default:
      break;
    }
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onAddNewStageRRR(d));
  }

  #onAddNewStageRRR(data) {
    let project = new dat.Project(data.project);
    dba.Workshop.updateProject(project);
    let stage = project.getStage(data.stage_id);
    if (stage) {
      let v = new ui.View();
      let f = new wksp.FvcProjectStageEditor();
      f.setStage(stage);
      v.setContentFragment(f);
      this._owner.onContentFragmentRequestReplaceView(this, v, "Stage editor");
    }
  }
};

wksp.FvcCreateProjectStageChoice = FvcCreateProjectStageChoice;
}(window.wksp = window.wksp || {}));
