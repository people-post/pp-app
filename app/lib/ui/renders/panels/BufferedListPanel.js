import { Panel } from './Panel.js';
import { PanelWrapper } from './PanelWrapper.js';
import { ListPanel } from './ListPanel.js';

const _CPT_BUFFERED_LIST = {
  MAIN : `<div id="__ID_HEAD__"></div>
    <div id="__ID_MAIN__"></div>
    <div id="__ID_TAIL__"></div>`,
}

export class BufferedListPanel extends Panel {
  #pHead;
  #pMain;
  #pTail;

  constructor() {
    super();
    this.#pHead = new PanelWrapper();
    this.#pMain = new ListPanel();
    this.#pTail = new PanelWrapper();
  }

  getHeadPanel() { return this.#pHead; }
  getMainPanel() { return this.#pMain; }
  getTailPanel() { return this.#pTail; }

  _renderFramework() {
    let s = _CPT_BUFFERED_LIST.MAIN;
    s = s.replace("__ID_HEAD__", this._getSubElementId("H"));
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_TAIL__", this._getSubElementId("T"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pHead.attach(this._getSubElementId("H"));
    this.#pMain.attach(this._getSubElementId("M"));
    this.#pTail.attach(this._getSubElementId("T"));
  }
}

