import { FScrollViewContent } from '../fragments/FScrollViewContent.js';
import { Button } from '../fragments/Button.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

export class FvcProgress extends FScrollViewContent {
  #messages = [];
  #btnCancel = null;

  constructor() {
    super();
    this.#btnCancel = new Button();
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
    let pList = new ListPanel();
    render.wrapPanel(pList);
    let p = new ListPanel();
    pList.pushPanel(p);

    for (let m of this.#messages) {
      let pp = new Panel();
      p.pushPanel(pp);
      pp.replaceContent(m);
    }

    pList.pushSpace(1);

    p = new PanelWrapper();
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
