import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { TextArea } from '../../lib/ui/controllers/fragments/TextArea.js';
import { ButtonList } from '../../lib/ui/controllers/fragments/ButtonList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';

export class FvcProposalEditor extends FScrollViewContent {
  constructor() {
    super();
    this._fTitle = new TextInput();
    this._fAbstract = new TextArea();
    this._fAbstract.setDelegate(this);
    this._fAbstract.setClassName("w100 h120px");

    this._fTitle.setConfig(
        {title : "", hint : "Title", value : "", isRequired : true});
    this._fAbstract.setConfig(
        {title : "", hint : "Abstract", value : "", isRequired : true});

    this._fActions = new ButtonList();
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
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new SectionPanel("Title");
    p.pushPanel(pp);
    this._fTitle.attachRender(pp.getContentPanel());
    this._fTitle.render();

    pp = new SectionPanel("Abstract");
    p.pushPanel(pp);
    this._fAbstract.attachRender(pp.getContentPanel());
    this._fAbstract.render();

    p.pushSpace(1);

    pp = new PanelWrapper();
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
    api.asyncFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #onSubmitRRR(data) { this._owner.onContentFragmentRequestPopView(this); }
};
