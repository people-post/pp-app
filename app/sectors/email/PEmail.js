
const _CPT_EMAIL = {
  MAIN : `<div class="pad5">
    <div class="email-header">
      <div class="flex space-between">
        <div id="__ID_SENDER__" class="u-font4"></div>
        <div id="__ID_TIME__" class="u-font4"></div>
      </div>
      <div id="__ID_RECEIVER__" class="u-font4"></div>
      <div id="__ID_CC__" class="u-font4"></div>
    </div>
    <div id="__ID_TITLE__" class="u-font3 bold"></div>
    <br>
    <div id="__ID_CONTENT__" class="u-font4"></div>
  </div>`,
}

class PEmail extends emal.PEmailBase {
  constructor() {
    super();
    this._pReceiver = new ui.Panel();
    this._pCarbonCopy = new ui.Panel();
  }

  getReceiverPanel() { return this._pReceiver; }
  getCarbonCopyPanel() { return this._pCarbonCopy; }

  _renderFramework() {
    let s = _CPT_EMAIL.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TI"));
    s = s.replace("__ID_SENDER__", this._getSubElementId("S"));
    s = s.replace("__ID_RECEIVER__", this._getSubElementId("R"));
    s = s.replace("__ID_CC__", this._getSubElementId("CC"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pTitle.attach(this._getSubElementId("T"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pTime.attach(this._getSubElementId("TI"));
    this._pSender.attach(this._getSubElementId("S"));
    this._pReceiver.attach(this._getSubElementId("R"));
    this._pCarbonCopy.attach(this._getSubElementId("CC"));
  }
};

emal.PEmail = PEmail;
}(window.emal = window.emal || {}));
