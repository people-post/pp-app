import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ProjectStage } from '../../common/datatypes/ProjectStage.js';
import { Project } from '../../common/datatypes/Project.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { FvcProjectStageEditor } from './FvcProjectStageEditor.js';
import { Api } from '../../common/plt/Api.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcCreateProjectStageChoice extends FScrollViewContent {
  protected _fBtnSimple: Button;
  protected _fBtnRef: Button;
  protected _fBtnCheckin: Button;
  protected _fBtnSwitch: Button;
  protected _projectId: string | null;
  protected _stageId: string | null;
  protected _position: string | null;

  constructor() {
    super();
    this._fBtnSimple = new Button();
    this._fBtnSimple.setName("Simple stage");
    this._fBtnSimple.setValue(ProjectStage.TYPES.SIMPLE);
    this._fBtnSimple.setDelegate(this);
    this.setChild("btnSimple", this._fBtnSimple);

    this._fBtnRef = new Button();
    this._fBtnRef.setName("Link to another stage");
    this._fBtnRef.setValue(ProjectStage.TYPES.REFERENCE);
    this._fBtnRef.setDelegate(this);
    this._fBtnRef.setEnabled(false);
    this.setChild("btnRef", this._fBtnRef);

    this._fBtnCheckin = new Button();
    this._fBtnCheckin.setName("Check in stage");
    this._fBtnCheckin.setValue(ProjectStage.TYPES.CHECK_IN);
    this._fBtnCheckin.setDelegate(this);
    this._fBtnCheckin.setEnabled(false);
    this.setChild("btnCheckin", this._fBtnCheckin);

    this._fBtnSwitch = new Button();
    this._fBtnSwitch.setName("Branch switch stage");
    this._fBtnSwitch.setValue(ProjectStage.TYPES.SWITCH);
    this._fBtnSwitch.setDelegate(this);
    this._fBtnSwitch.setEnabled(false);
    this.setChild("btnSwitch", this._fBtnSwitch);

    this._projectId = null;
    this._stageId = null;
    this._position = null;
  }

  onSimpleButtonClicked(fBtn: Button): void { this.#asyncAddNewStage(fBtn.getValue() as symbol); }

  setProjectId(id: string | null): void { this._projectId = id; }
  setBeforeStage(stageId: string | null): void {
    this._stageId = stageId;
    this._position = "BEFORE";
  }
  setAfterStage(stageId: string | null): void {
    this._stageId = stageId;
    this._position = "AFTER";
  }

  _renderContentOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    p.pushSpace(1);

    for (let f of [this._fBtnSimple, this._fBtnRef, this._fBtnCheckin,
                   this._fBtnSwitch]) {
      let pp = new PanelWrapper();
      p.pushPanel(pp);
      f.attachRender(pp);
      f.render();
      p.pushSpace(1);
    }
  }

  #asyncAddNewStage(type: symbol): void {
    if (!this._projectId) {
      return;
    }
    let url = "api/workshop/add_project_stage";
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("type", String(type));
    switch (this._position) {
    case "AFTER":
      if (this._stageId) {
        fd.append("after_stage_id", this._stageId);
      }
      break;
    case "BEFORE":
      if (this._stageId) {
        fd.append("before_stage_id", this._stageId);
      }
      break;
    default:
      break;
    }
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onAddNewStageRRR(d));
  }

  #onAddNewStageRRR(data: unknown): void {
    let projectData = (data as { project?: unknown; stage_id?: string }).project;
    if (!projectData) {
      return;
    }
    let project = new Project(projectData as Parameters<typeof Project>[0]);
    Workshop.updateProject(project);
    let stageId = (data as { project?: unknown; stage_id?: string }).stage_id;
    if (stageId) {
      let stage = project.getStage(stageId);
      if (stage) {
        let v = new View();
        let f = new FvcProjectStageEditor();
        f.setStage(stage);
        v.setContentFragment(f);
        this._owner.onContentFragmentRequestReplaceView(this, v, "Stage editor");
      }
    }
  }
};
