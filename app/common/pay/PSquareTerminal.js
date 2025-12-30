const _CPT_SQUARE_TERMINAL = {
  MAIN : `<div id="__ID_TITLE__"></div>
  <div id="__ID_DEVICE_ID__"></div>
  <div id="__ID_PAIR_CODE__"></div>
  <div id="__ID_PAIR_BY__"></div>
  <div id="__ID_STATUS__"></div>
  <div id="__ID_PAIRED_AT__"></div>`,
};

export class PSquareTerminal extends ui.Panel {
  constructor() {
    super();
    this._pTitle = new ui.Panel();
    this._pDeviceId = new ui.Panel();
    this._pPairCode = new ui.Panel();
    this._pPairBy = new ui.Panel();
    this._pStatus = new ui.Panel();
    this._pPairedAt = new ui.Panel();
  }

  getTitlePanel() { return this._pTitle; }
  getDeviceIdPanel() { return this._pDeviceId; }
  getPairCodePanel() { return this._pPairCode; }
  getPairByPanel() { return this._pPairBy; }
  getStatusPanel() { return this._pStatus; }
  getPairedAtPanel() { return this._pPairedAt; }

  _renderFramework() {
    let s = _CPT_SQUARE_TERMINAL.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_DEVICE_ID__", this._getSubElementId("D"));
    s = s.replace("__ID_PAIR_CODE__", this._getSubElementId("PC"));
    s = s.replace("__ID_PAIR_BY__", this._getSubElementId("PB"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    s = s.replace("__ID_PAIRED_AT__", this._getSubElementId("PA"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pTitle.attach(this._getSubElementId("T"));
    this._pDeviceId.attach(this._getSubElementId("D"));
    this._pPairCode.attach(this._getSubElementId("PC"));
    this._pPairBy.attach(this._getSubElementId("PB"));
    this._pStatus.attach(this._getSubElementId("S"));
    this._pPairedAt.attach(this._getSubElementId("PA"));
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.pay = window.pay || {};
  window.pay.PSquareTerminal = PSquareTerminal;
}
