import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { ProjectStage } from '../../common/datatypes/ProjectStage.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FProjectStage } from './FProjectStage.js';
import { FvcProjectStageEditor } from './FvcProjectStageEditor.js';

export class FvcProjectStage extends FScrollViewContent {
  constructor() {
    super();
    this._fBtnEdit = new ActionButton();
    this._fBtnEdit.setIcon(ActionButton.T_ICON.EDIT);
    this._fBtnEdit.setDelegate(this);
    this._fStage = null;
  }

  setStage(stage) {
    this._fStage = this.#createStageFragment(stage);
    this.setChild("stage", this._fStage);
  }

  getActionButton() {
    if (window.dba.Account.isAuthenticated()) {
      if (this.#isEditableByUser(window.dba.Account.getId())) {
        return this._fBtnEdit;
      }
    }
    return null;
  }

  onGuiActionButtonClick(fActionButton) { this.#onEdit(); }

  onClickInProjectStageFragment(fStage) {}

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.PROJECT:
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
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fStage.attachRender(pp);
    this._fStage.render();
  }

  #createStageFragment(stage) {
    let f;
    switch (stage.getType()) {
    case ProjectStage.TYPES.CHECK_IN:
      f = new CheckinStageFragment();
      break;
    case ProjectStage.TYPES.REFERENCE:
      f = new ReferenceStageFragment();
      break;
    default:
      f = new FProjectStage();
      f.setLayoutType(FProjectStage.LT_FULL);
      break;
    }
    f.setStage(stage);
    f.setDelegate(this);
    return f;
  }

  #onEdit() {
    let v = new View();
    let f = new FvcProjectStageEditor();
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
        Workshop.getProject(this._fStage.getStage().getProjectId());
    return project && !project.isFinished() && project.isFacilitator(userId);
  }
};
