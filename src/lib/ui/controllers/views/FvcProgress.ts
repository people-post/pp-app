import { FScrollViewContent } from '../fragments/FScrollViewContent.js';
import { Button } from '../fragments/Button.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

interface FvcProgressDelegate {
  onRequestCancelInProgressViewContentFragment(f: FvcProgress): void;
}

export class FvcProgress extends FScrollViewContent {
  #messages: string[] = [];
  #btnCancel: Button;

  protected declare _delegate: FvcProgressDelegate;

  constructor() {
    super();
    this.#btnCancel = new Button();
    this.#btnCancel.setName("Cancel");
    this.#btnCancel.setDelegate(this);
    this.setChild("btnCancel", this.#btnCancel);
  }

  addProgress(msg: string, _delta: number): void {
    this.#messages.push(msg);
    this.render();
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onCancel(); }

  _renderContentOnRender(render: any): void {
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

  #onCancel(): void {
    if (this._delegate) {
      this._delegate.onRequestCancelInProgressViewContentFragment(this);
    }
    if (this._owner) {
      (this._owner as any).onContentFragmentRequestPopView(this);
    }
  }
}

