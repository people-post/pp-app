import { Panel } from '../../lib/ui/renders/panels/Panel.js';

const _CPT_BASIC = {
  MAIN : `<div id="__ID_NICKNAME__"></div>
    <br>
    <div id="__ID_OPTIONS__"></div>
    <br>
    <div id="__ID_BTNS__"></div>`,
} as const;

export class PBasic extends Panel {
  protected _pNickname: Panel;
  protected _pOptions: Panel;
  protected _pBtns: Panel;

  constructor() {
    super();
    this._pNickname = new Panel();
    this._pOptions = new Panel();
    this._pBtns = new Panel();
  }

  getNicknamePanel(): Panel { return this._pNickname; }
  getOptionsPanel(): Panel { return this._pOptions; }
  getBtnsPanel(): Panel { return this._pBtns; }

  _renderFramework(): string {
    let s = _CPT_BASIC.MAIN;
    s = s.replace("__ID_NICKNAME__", this._getSubElementId("NN"));
    s = s.replace("__ID_OPTIONS__", this._getSubElementId("O"));
    s = s.replace("__ID_BTNS__", this._getSubElementId("B"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pNickname.attach(this._getSubElementId("NN"));
    this._pOptions.attach(this._getSubElementId("O"));
    this._pBtns.attach(this._getSubElementId("B"));
  }
}
