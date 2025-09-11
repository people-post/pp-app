(function(cmut) {
class FvcProposalEditor extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fTitle = new ui.TextInput();
    this._fAbstract = new ui.TextArea();
    this._fAbstract.setDelegate(this);
    this._fAbstract.setClassName("w100 h120px");

    this._fTitle.setConfig(
        {title : "", hint : "Title", value : "", isRequired : true});
    this._fAbstract.setConfig(
        {title : "", hint : "Abstract", value : "", isRequired : true});

    this._fActions = new ui.ButtonList();
    this._fActions.setDelegate(this);
    this._fActions.addButton("Submit", () => this.#asyncSubmit(this));
    this._fActions.addButton(
        "Cancel", () => this._owner.onContentFragmentRequestPopView(this),
        true);

    this.setChild("title", this._fTitle);
    this.setChild("abstract", this._fAbstract);
    this.setChild("actions", this._fActions);
  }

  onInputChangeInTextArea(fTextArea, text) {}

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.SectionPanel("Title");
    p.pushPanel(pp);
    this._fTitle.attachRender(pp.getContentPanel());
    this._fTitle.render();

    pp = new ui.SectionPanel("Abstract");
    p.pushPanel(pp);
    this._fAbstract.attachRender(pp.getContentPanel());
    this._fAbstract.render();

    p.pushSpace(1);

    pp = new ui.Panel("Abstract");
    p.pushPanel(pp);
    this._fActions.attachRender(pp);
    this._fActions.render();
  }

  #collectFormData() {
    let fd = new FormData();
    fd.append('title', this._fTitle.getValue());
    fd.append('abstract', this._fAbstract.getValue());
    return fd;
  }

  #asyncSubmit() {
    let fd = this.#collectFormData();
    let url = "api/community/propose";
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #onSubmitRRR(data) { this._owner.onContentFragmentRequestPopView(this); }
};

cmut.FvcProposalEditor = FvcProposalEditor;
}(window.cmut = window.cmut || {}));
