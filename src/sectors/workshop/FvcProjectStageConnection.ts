import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { Project } from '../../common/datatypes/Project.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FProjectStage } from './FProjectStage.js';
import { Api } from '../../common/plt/Api.js';
import type { ProjectStage } from '../../common/datatypes/ProjectStage.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcProjectStageConnection extends FScrollViewContent {
  protected _stage: ProjectStage | null = null;
  protected _fList: FSimpleFragmentList;
  protected _fBtnSubmit: Button;

  constructor() {
    super();
    this._fList = new FSimpleFragmentList();
    this.setChild("list", this._fList);

    this._fBtnSubmit = new Button();
    this._fBtnSubmit.setName("Submit");
    this._fBtnSubmit.setDelegate(this);
    this.setChild("submit", this._fBtnSubmit);
  }

  setStage(stage: ProjectStage): void { this._stage = stage; }

  onClickInProjectStageFragment(fStage: FProjectStage): void {
    fStage.setSelected(!fStage.isSelected());
    fStage.render();
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onSubmit(); }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.PROJECT:
      if (this._stage && data instanceof Project && data.getId() == this._stage.getProjectId()) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: Render): void {
    if (!this._stage) {
      return;
    }

    let project = Workshop.getProject(this._stage.getProjectId());
    if (!project) {
      return;
    }

    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new Panel();
    pp.setClassName("u-font3");
    p.pushPanel(pp);
    pp.replaceContent("Select required stages:");

    pp = new PanelWrapper();
    p.pushPanel(pp);
    let stages = project.getStages();
    let downstreamIds =
        project.getStagesAfter(this._stage.getId()).map(s => s.getId());
    this._fList.clear();
    for (let stage of stages) {
      if (stage.getId() == this._stage.getId()) {
        continue;
      }
      let f = new FProjectStage();
      f.setStage(stage);
      f.setDelegate(this);
      f.setLayoutType(FProjectStage.LT_MENU_ITEM);
      f.setEnableActions(false);
      f.setSelected(this._stage.hasDependencyOn(stage.getId()));
      if (downstreamIds.indexOf(stage.getId()) >= 0) {
        f.setEnabled(false);
      }
      this._fList.append(f);
    }
    this._fList.attachRender(pp);
    this._fList.render();

    p.pushSpace(1);
    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fBtnSubmit.attachRender(pp);
    this._fBtnSubmit.render();
  }

  #onSubmit(): void {
    if (!this._stage) {
      return;
    }

    let url = "api/workshop/connect_project_stage";
    let fd = new FormData();
    fd.append("project_id", this._stage.getProjectId());
    fd.append("stage_id", this._stage.getId());
    for (let f of this._fList.getChildren()) {
      if (f instanceof FProjectStage && f.isSelected()) {
        fd.append("to_ids", f.getStage().getId());
      }
    }

   Api.asyncRawPost(url, fd, r => this.#onSubmitRRR(r));
  }

  #onSubmitRRR(responseText: string): void {
    let response = JSON.parse(responseText) as { error?: string; data?: { project: unknown } };
    if (response.error) {
      this.onErrorInFragment(response.error);
    } else if (response.data) {
      Workshop.updateProject(new Project(response.data.project));
      this._owner.onContentFragmentRequestPopView(this);
    }
  }
}
