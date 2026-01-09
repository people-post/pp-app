export const CF_STAGE_EDITOR = {
  SUBMIT : "CF_STAGE_EDITOR_1",
} as const;

// Export to window for HTML string templates
declare global {
  interface Window {
    CF_STAGE_EDITOR?: typeof CF_STAGE_EDITOR;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_STAGE_EDITOR = CF_STAGE_EDITOR;
}

const _CFT_STAGE_EDITOR = {
  BTN_SUBMIT :
      `<a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CF_STAGE_EDITOR.SUBMIT)">Submit</a>`,
} as const;

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { TextArea } from '../../lib/ui/controllers/fragments/TextArea.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { Project } from '../../common/datatypes/Project.js';
import { Api } from '../../common/plt/Api.js';
import type { ProjectStage } from '../../common/datatypes/ProjectStage.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcProjectStageEditor extends FScrollViewContent {
  protected _fTitle: TextInput;
  protected _fContent: TextArea;
  protected _stage: ProjectStage | null = null;

  constructor() {
    super();
    this._fTitle = new TextInput();
    this._fContent = new TextArea();
    this._fContent.setClassName("w100 h120px");
    this._fContent.setDelegate(this);
    this.setChild("title", this._fTitle);
    this.setChild("content", this._fContent);
  }

  setStage(stage: ProjectStage): void { this._stage = stage; }

  onInputChangeInTextArea(_fTextArea: TextArea, _text: string): void {}

  _renderContentOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let stage = this._stage;

    let pp = new SectionPanel("Title");
    p.pushPanel(pp);
    this._fTitle.setConfig(
        {hint : "Title", value : stage ? stage.getName() : ""});
    this._fTitle.attachRender(pp.getContentPanel());
    this._fTitle.render();

    p.pushSpace(1);

    pp = new SectionPanel("Description");
    p.pushPanel(pp);
    this._fContent.setConfig(
        {hint : "Description", value : stage ? stage.getDescription() : ""});
    this._fContent.attachRender(pp.getContentPanel());
    this._fContent.render();

    p.pushSpace(3);

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(_CFT_STAGE_EDITOR.BTN_SUBMIT);

    p.pushSpace(2);
  }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_STAGE_EDITOR.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  #collectData(): FormData {
    let fd = new FormData();
    fd.append("title", this._fTitle.getValue());
    let stage = this._stage;
    if (!stage) {
      return fd;
    }
    fd.append("project_id", stage.getProjectId());
    fd.append("stage_id", stage.getId());
    fd.append("description", this._fContent.getValue());
    return fd;
  }

  #onSubmit(): void {
    let url = 'api/workshop/update_project_stage';
    let fd = this.#collectData();
    Api.asFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #onSubmitRRR(data: unknown): void {
    let dataObj = data as { project: unknown };
    Workshop.updateProject(new Project(dataObj.project));
    this._owner.onContentFragmentRequestPopView(this);
  }
}
