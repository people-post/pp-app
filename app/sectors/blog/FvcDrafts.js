
export class FvcDrafts extends ui.FScrollViewContent {
  #fInsiderAuthored;
  #fInsiderTasks;
  #fTasks;

  constructor() {
    super();
    this.#fInsiderAuthored = new blog.FInsiderAuthorDraftList();
    this.setChild("insiderAuthored", this.#fInsiderAuthored);

    this.#fInsiderTasks = new blog.FInsiderTaskDraftList();
    this.setChild("insiderTasks", this.#fInsiderTasks);

    this.#fTasks = new blog.FOwnerDraftList();
    this.setChild("tasks", this.#fTasks);
  }

  _renderContentOnRender(render) {
    let pList = new ui.ListPanel();
    render.wrapPanel(pList);

    let p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#fInsiderAuthored.attachRender(p);
    this.#fInsiderAuthored.render();

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#fInsiderTasks.attachRender(p);
    this.#fInsiderTasks.render();

    if (dba.Account.isWebOwner()) {
      p = new ui.SectionPanel("Tasks");
      pList.pushPanel(p);
      this.#fTasks.attachRender(p.getContentPanel());
      this.#fTasks.render();
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcDrafts = FvcDrafts;
}
