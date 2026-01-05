import { Panel } from './Panel.js';
import { PanelWrapper } from './PanelWrapper.js';
import { ListPanel } from './ListPanel.js';

const _CPT_BUFFERED_LIST = {
  MAIN : `<div id="__ID_HEAD__"></div>
    <div id="__ID_MAIN__"></div>
    <div id="__ID_TAIL__"></div>`,
} as const;

export class BufferedListPanel extends Panel {
  #pHead: PanelWrapper;
  #pMain: ListPanel;
  #pTail: PanelWrapper;

  constructor() {
    super();
    this.#pHead = new PanelWrapper();
    this.#pMain = new ListPanel();
    this.#pTail = new PanelWrapper();
  }

  getHeadPanel(): PanelWrapper { return this.#pHead; }
  getMainPanel(): ListPanel { return this.#pMain; }
  getTailPanel(): PanelWrapper { return this.#pTail; }

  _renderFramework(): string {
    let s: string = _CPT_BUFFERED_LIST.MAIN;
    s = s.replace("__ID_HEAD__", this._getSubElementId("H")) as string;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M")) as string;
    s = s.replace("__ID_TAIL__", this._getSubElementId("T")) as string;
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pHead.attach(this._getSubElementId("H"));
    this.#pMain.attach(this._getSubElementId("M"));
    this.#pTail.attach(this._getSubElementId("T"));
  }
}

