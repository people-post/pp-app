(function(acnt) {
const _CPT_BASIC = {
  MAIN : `<div id="__ID_NICKNAME__"></div>
    <br>
    <div id="__ID_OPTIONS__"></div>
    <br>
    <div id="__ID_BTNS__"></div>`,
}

class PBasic extends ui.Panel {
  constructor() {
    super();
    this._pNickname = new ui.Panel();
    this._pOptions = new ui.Panel();
    this._pBtns = new ui.Panel();
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
};

acnt.PBasic = PBasic;
}(window.acnt = window.acnt || {}));
