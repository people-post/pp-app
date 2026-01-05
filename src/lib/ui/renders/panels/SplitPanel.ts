import { Panel } from './Panel.js';
import { PanelWrapper } from './PanelWrapper.js';

const _CPT_SPLIT = {
  MAIN : `<div id="__ID_LEFT__"></div>
  <div id="__ID_RIGHT__"></div>`,
} as const;

export class SplitPanel extends Panel {
  declare _pLeft: PanelWrapper;
  declare _pRight: PanelWrapper;
  declare _mode: symbol;
  static M_SIDE: symbol = Symbol();

  constructor() {
    super();
    this.setClassName("flex space-between");
    this._pLeft = new PanelWrapper();
    this._pRight = new PanelWrapper();
    this._mode = (SplitPanel as any).M_SIDE;
  }

  getLeftPanel(): PanelWrapper { return this._pLeft; }
  getRightPanel(): PanelWrapper { return this._pRight; }

  _renderFramework(): string {
    let s: string = _CPT_SPLIT.MAIN;
    s = s.replace("__ID_LEFT__", this._getSubElementId("L")) as string;
    s = s.replace("__ID_RIGHT__", this._getSubElementId("R")) as string;
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pLeft.attach(this._getSubElementId("L"));
    this._pRight.attach(this._getSubElementId("R"));
  }
}

