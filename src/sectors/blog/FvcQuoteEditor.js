import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { TextArea } from '../../lib/ui/controllers/fragments/TextArea.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FQuoteElement } from './FQuoteElement.js';
import { Api } from '../../common/plt/Api.js';

export class FvcQuoteEditor extends FScrollViewContent {
  constructor() {
    super();
    this._fDetail = new TextArea();
    this._fDetail.setDelegate(this);
    this._fDetail.setConfig(
        {title : "Content", hint : "", value : "", isRequired : true});
    this._fQuote = new FQuoteElement();
    this._fQuote.setDelegate(this);
    this._fBtnSubmit = new Button();
    this._fBtnSubmit.setName("Submit");
    this._fBtnSubmit.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this._fBtnSubmit.setDelegate(this);

    this.setChild("detail", this._fDetail);
    this.setChild("quote", this._fQuote);
    this.setChild("btnsubmit", this._fBtnSubmit);
  }

  setItem(item, type) { this._fQuote.setItem(item, type); }

  onSimpleButtonClicked(fButton) { this.#asyncSubmit(); }
  onInputChangeInTextArea(fTextArea) {};
  onQuotedElementRequestShowView(fQuote, view) {}

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fDetail.setClassName("w100");
    this._fDetail.attachRender(pp);
    this._fDetail.render();

    pp = new PanelWrapper();
    pp.setClassName("pad5");
    p.pushPanel(pp);
    this._fQuote.attachRender(pp);
    this._fQuote.render();

    p.pushSpace(1);

    pp = new Panel();
    p.pushPanel(pp);
    this._fBtnSubmit.attachRender(pp);
    this._fBtnSubmit.render();

    p.pushSpace(2);
  }

  #asyncSubmit() {
    let fd = new FormData();
    fd.append("title", ""); // TODO
    fd.append("content", this._fDetail.getValue());
    fd.append("link_to", this._fQuote.getItem());
    let t = this._fQuote.getType();
    if (t) {
      fd.append("link_type", t);
    }
    let url = "api/blog/post_article";
    Api.asFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #onSubmitRRR(data) {
    this._owner.onContentFragmentRequestPopView(this);
    this._delegate.onQuotePostedInQuoteEditorContentFragment(this);
  }
};
