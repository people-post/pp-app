import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { TextArea } from '../../lib/ui/controllers/fragments/TextArea.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FQuoteElement } from './FQuoteElement.js';
import { Api } from '../../common/plt/Api.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import type Render from '../../lib/ui/renders/Render.js';

interface QuoteEditorDelegate {
  onQuotePostedInQuoteEditorContentFragment(f: FvcQuoteEditor): void;
}

export class FvcQuoteEditor extends FScrollViewContent {
  protected _fDetail: TextArea;
  protected _fQuote: FQuoteElement;
  protected _fBtnSubmit: Button;
  protected _delegate!: QuoteEditorDelegate;

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

  setItem(item: string, type: string): void { this._fQuote.setItem(item, type); }

  onSimpleButtonClicked(_fButton: Button): void { this.#asyncSubmit(); }
  onInputChangeInTextArea(_fTextArea: TextArea): void {};
  onQuotedElementRequestShowView(_fQuote: FQuoteElement, _view: View): void {}

  _renderContentOnRender(render: Render): void {
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

  #asyncSubmit(): void {
    let fd = new FormData();
    fd.append("title", ""); // TODO
    fd.append("content", this._fDetail.getValue());
    let item = this._fQuote.getItem();
    if (item) {
      fd.append("link_to", item);
    }
    let t = this._fQuote.getType();
    if (t) {
      fd.append("link_type", t);
    }
    let url = "api/blog/post_article";
    Api.asFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #onSubmitRRR(_data: unknown): void {
    this._owner.onContentFragmentRequestPopView(this);
    this._delegate.onQuotePostedInQuoteEditorContentFragment(this);
  }
}
