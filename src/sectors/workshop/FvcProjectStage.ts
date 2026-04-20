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
import { Project } from '../../common/datatypes/Project.js';
import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Account } from '../../common/dba/Account.js';

export interface FvcProjectStageDelegate {
  onClickInProjectStageFragment(fStage: FProjectStage): void;
}

export class FvcProjectStage extends FScrollViewContent {
  protected _fBtnEdit: ActionButton;
  protected _fStage: Fragment | null;

  constructor() {
    super();
    this._fBtnEdit = new ActionButton();
    this._fBtnEdit.setIcon(ActionButton.T_ICON.EDIT);
    this._fBtnEdit.setDelegate(this);
    this._fStage = null;
  }

  setStage(stage: ProjectStage): void {
    this._fStage = this.#createStageFragment(stage);
    this.setChild("stage", this._fStage);
  }

  getActionButton(): ActionButton | null {
    if (Account.isAuthenticated()) {
      if (this._fStage && this.#isEditableByUser(Account.getId())) {
        return this._fBtnEdit;
      }
    }
    return null;
  }

  onGuiActionButtonClick(_fActionButton: ActionButton): void { this.#onEdit(); }

  onClickInProjectStageFragment(_fStage: FProjectStage): void {}

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.PROJECT:
      if (this._fStage && (data as Project).getId() == (this._fStage as FProjectStage).getStage()?.getProjectId()) {
        this._requestUpdateHeader();
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: PanelWrapper): void {
    if (!this._fStage) {
      return;
    }
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fStage.attachRender(pp);
    this._fStage.render();
  }

  #createStageFragment(stage: ProjectStage): Fragment {
    let f: Fragment;
    switch (stage.getType()) {
    case ProjectStage.TYPES.CHECK_IN:
      // f = new CheckinStageFragment();
      // break;
    case ProjectStage.TYPES.REFERENCE:
      // f = new ReferenceStageFragment();
      // break;
    default:
      f = new FProjectStage();
      (f as FProjectStage).setLayoutType(FProjectStage.LT_FULL);
      break;
    }
    (f as FProjectStage).setStage(stage);
    (f as FProjectStage).setDelegate(this);
    return f;
  }

  #onEdit(): void {
    if (!this._fStage) {
      return;
    }
    let stage = (this._fStage as FProjectStage).getStage();
    if (!stage) {
      return;
    }
    let v = new View();
    let f = new FvcProjectStageEditor();
    f.setStage(stage);
    v.setContentFragment(f);
    this._requestReplaceView(v, "Stage editor");
  }

  #isEditableByUser(userId: string | null): boolean {
    if (!userId) {
      return false;
    }
    if (!this._fStage) {
      return false;
    }
    let stage = (this._fStage as FProjectStage).getStage();
    if (!stage) {
      return false;
    }
    // TODO: Based on actions from Utilities instead of roles
    if (stage.isDone()) {
      return false;
    }

    let project =
        Workshop.getProject(stage.getProjectId());
    return project ? !project.isFinished() && project.isFacilitator(userId) : false;
  }
};
