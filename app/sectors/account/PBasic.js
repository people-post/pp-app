import { Panel } from '../../lib/ui/renders/panels/Panel.js';

const _CPT_BASIC = {
  MAIN : `<div id="__ID_NICKNAME__"></div>
    <br>
    <div id="__ID_OPTIONS__"></div>
    <br>
    <div id="__ID_BTNS__"></div>`,
}

export class PBasic extends Panel {
  constructor() {
    super();
    this._pNickname = new Panel();
    this._pOptions = new Panel();
    this._pBtns = new Panel();
  }

  getNicknamePanel() { return this._pNickname; }
  getOptionsPanel() { return this._pOptions; }
  getBtnsPanel() { return this._pBtns; }

  _renderFramework() {
    let s = _CPT_BASIC.MAIN;
    s = s.replace("__ID_NICKNAME__", this._getSubElementId("NN"));
    s = s.replace("__ID_OPTIONS__", this._getSubElementId("O"));
    s = s.replace("__ID_BTNS__", this._getSubElementId("B"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pNickname.attach(this._getSubElementId("NN"));
    this._pOptions.attach(this._getSubElementId("O"));
    this._pBtns.attach(this._getSubElementId("B"));
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.acnt = window.acnt || {};
  window.acnt.PBasic = PBasic;
}
