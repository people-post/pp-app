(function(ui) {
class FvcProgress extends ui.FScrollViewContent {
  #messages = [];
  #btnCancel = null;

  constructor() {
    super();
    this.#btnCancel = new ui.Button();
    this.#btnCancel.setName("Cancel");
    this.#btnCancel.setDelegate(this);
    this.setChild("btnCancel", this.#btnCancel);
  }

  addProgress(msg, delta) {
    this.#messages.push(msg);
    this.render();
  }

  onSimpleButtonClicked(fBtn) { this.#onCancel(); }

  _renderContentOnRender(render) {
    let pList = new ui.ListPanel();
    render.wrapPanel(pList);
    let p = new ui.ListPanel();
    pList.pushPanel(p);

    for (let m of this.#messages) {
      let pp = new ui.Panel();
      p.pushPanel(pp);
      pp.replaceContent(m);
    }

    pList.pushSpace(1);

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#btnCancel.attachRender(p);
    this.#btnCancel.render();
  }

  #onCancel() {
    if (this._delegate) {
      this._delegate.onRequestCancelInProgressViewContentFragment(this);
    }
    this._owner.onContentFragmentRequestPopView(this);
  }
};

ui.FvcProgress = FvcProgress;
}(window.ui = window.ui || {}));
