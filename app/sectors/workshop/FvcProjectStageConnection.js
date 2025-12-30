import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';

export class FvcProjectStageConnection extends FScrollViewContent {
  constructor() {
    super();
    this._stage = null;
    this._fList = new FSimpleFragmentList();
    this.setChild("list", this._fList);

    this._fBtnSubmit = new Button();
    this._fBtnSubmit.setName("Submit");
    this._fBtnSubmit.setDelegate(this);
    this.setChild("submit", this._fBtnSubmit);
  }

  setStage(stage) { this._stage = stage; }

  onClickInProjectStageFragment(fStage) {
    fStage.setSelected(!fStage.isSelected());
    fStage.render();
  }
  onSimpleButtonClicked(fBtn) { this.#onSubmit(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.PROJECT:
      if (data.getId() == this._stage.getProjectId()) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    let project = dba.Workshop.getProject(this._stage.getProjectId());
    if (!project) {
      return;
    }

    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let pp = new ui.Panel();
    pp.setClassName("u-font3");
    p.pushPanel(pp);
    pp.replaceContent("Select required stages:");

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    let stages = project.getStages();
    let downstreamIds =
        project.getStagesAfter(this._stage.getId()).map(s => s.getId());
    this._fList.clear();
    for (let stage of stages) {
      if (stage.getId() == this._stage.getId()) {
        continue;
      }
      let f = new wksp.FProjectStage();
      f.setStage(stage);
      f.setDelegate(this);
      f.setLayoutType(wksp.FProjectStage.LT_MENU_ITEM);
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
    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this._fBtnSubmit.attachRender(pp);
    this._fBtnSubmit.render();
  }

  #onSubmit() {
    let url = "api/workshop/connect_project_stage";
    let fd = new FormData();
    fd.append("project_id", this._stage.getProjectId());
    fd.append("stage_id", this._stage.getId());
    for (let f of this._fList.getChildren()) {
      if (f.isSelected()) {
        fd.append("to_ids", f.getStage().getId());
      }
    }

   plt.Api.asyncRawPost(url, fd, r => this.#onSubmitRRR(r));
  }

  #onSubmitRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this.onErrorInFragment(response.error);
    } else {
      dba.Workshop.updateProject(new dat.Project(response.data.project));
      this._owner.onContentFragmentRequestPopView(this);
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.FvcProjectStageConnection = FvcProjectStageConnection;
}
