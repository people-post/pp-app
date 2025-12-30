
window.CF_STAGE_EDITOR = {
  SUBMIT : "CF_STAGE_EDITOR_1",
}

const _CFT_STAGE_EDITOR = {
  BTN_SUBMIT :
      `<a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CF_STAGE_EDITOR.SUBMIT)">Submit</a>`,
}

export class FvcProjectStageEditor extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fTitle = new ui.TextInput();
    this._fContent = new ui.TextArea();
    this._fContent.setClassName("w100 h120px");
    this._fContent.setDelegate(this);
    this.setChild("title", this._fTitle);
    this.setChild("content", this._fContent);

    this._stage = null;
  }

  setStage(stage) { this._stage = stage; }

  onInputChangeInTextArea(fTextArea, text) {}

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let stage = this._stage;

    let pp = new ui.SectionPanel("Title");
    p.pushPanel(pp);
    this._fTitle.setConfig(
        {hint : "Title", value : stage ? stage.getName() : ""});
    this._fTitle.attachRender(pp.getContentPanel());
    this._fTitle.render();

    p.pushSpace(1);

    pp = new ui.SectionPanel("Description");
    p.pushPanel(pp);
    this._fContent.setConfig(
        {hint : "Description", value : stage ? stage.getDescription() : ""});
    this._fContent.attachRender(pp.getContentPanel());
    this._fContent.render();

    p.pushSpace(3);

    pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(_CFT_STAGE_EDITOR.BTN_SUBMIT);

    p.pushSpace(2);
  }

  action(type, ...args) {
    switch (type) {
    case CF_STAGE_EDITOR.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  #collectData() {
    let fd = new FormData();
    fd.append("title", this._fTitle.getValue());
    let stage = this._stage;
    fd.append("project_id", stage.getProjectId());
    fd.append("stage_id", stage.getId());
    fd.append("description", this._fContent.getValue());
    return fd;
  }

  #onSubmit() {
    let url = 'api/workshop/update_project_stage';
    let fd = this.#collectData();
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #onSubmitRRR(data) {
    dba.Workshop.updateProject(new dat.Project(data.project));
    this._owner.onContentFragmentRequestPopView(this);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.FvcProjectStageEditor = FvcProjectStageEditor;
}
