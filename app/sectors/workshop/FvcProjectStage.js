
export class FvcProjectStage extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fBtnEdit = new gui.ActionButton();
    this._fBtnEdit.setIcon(gui.ActionButton.T_ICON.EDIT);
    this._fBtnEdit.setDelegate(this);
    this._fStage = null;
  }

  setStage(stage) {
    this._fStage = this.#createStageFragment(stage);
    this.setChild("stage", this._fStage);
  }

  getActionButton() {
    if (dba.Account.isAuthenticated()) {
      if (this.#isEditableByUser(dba.Account.getId())) {
        return this._fBtnEdit;
      }
    }
    return null;
  }

  onGuiActionButtonClick(fActionButton) { this.#onEdit(); }

  onClickInProjectStageFragment(fStage) {}

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.PROJECT:
      if (data.getId() == this._fStage.getStage().getProjectId()) {
        this._owner.onContentFragmentRequestUpdateHeader();
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this._fStage.attachRender(pp);
    this._fStage.render();
  }

  #createStageFragment(stage) {
    let f;
    switch (stage.getType()) {
    case dat.ProjectStage.TYPES.CHECK_IN:
      f = new CheckinStageFragment();
      break;
    case dat.ProjectStage.TYPES.REFERENCE:
      f = new ReferenceStageFragment();
      break;
    default:
      f = new wksp.FProjectStage();
      f.setLayoutType(wksp.FProjectStage.LT_FULL);
      break;
    }
    f.setStage(stage);
    f.setDelegate(this);
    return f;
  }

  #onEdit() {
    let v = new ui.View();
    let f = new wksp.FvcProjectStageEditor();
    f.setStage(this._fStage.getStage());
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v, "Stage editor");
  }

  #isEditableByUser(userId) {
    // TODO: Based on actions from Utilities instead of roles
    if (this._fStage.getStage().isDone()) {
      return false;
    }

    let project =
        dba.Workshop.getProject(this._fStage.getStage().getProjectId());
    return project && !project.isFinished() && project.isFacilitator(userId);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.FvcProjectStage = FvcProjectStage;
}
