import { Panel } from '../../lib/ui/renders/panels/Panel.js';

const _CPT_SQUARE_TERMINAL = {
  MAIN : `<div id="__ID_TITLE__"></div>
  <div id="__ID_DEVICE_ID__"></div>
  <div id="__ID_PAIR_CODE__"></div>
  <div id="__ID_PAIR_BY__"></div>
  <div id="__ID_STATUS__"></div>
  <div id="__ID_PAIRED_AT__"></div>`,
};

export class PSquareTerminal extends Panel {
  private _pTitle: Panel;
  private _pDeviceId: Panel;
  private _pPairCode: Panel;
  private _pPairBy: Panel;
  private _pStatus: Panel;
  private _pPairedAt: Panel;

  constructor() {
    super();
    this._pTitle = new Panel();
    this._pDeviceId = new Panel();
    this._pPairCode = new Panel();
    this._pPairBy = new Panel();
    this._pStatus = new Panel();
    this._pPairedAt = new Panel();
  }

  getTitlePanel(): Panel { return this._pTitle; }
  getDeviceIdPanel(): Panel { return this._pDeviceId; }
  getPairCodePanel(): Panel { return this._pPairCode; }
  getPairByPanel(): Panel { return this._pPairBy; }
  getStatusPanel(): Panel { return this._pStatus; }
  getPairedAtPanel(): Panel { return this._pPairedAt; }

  _renderFramework(): string {
    let s = _CPT_SQUARE_TERMINAL.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_DEVICE_ID__", this._getSubElementId("D"));
    s = s.replace("__ID_PAIR_CODE__", this._getSubElementId("PC"));
    s = s.replace("__ID_PAIR_BY__", this._getSubElementId("PB"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    s = s.replace("__ID_PAIRED_AT__", this._getSubElementId("PA"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pTitle.attach(this._getSubElementId("T"));
    this._pDeviceId.attach(this._getSubElementId("D"));
    this._pPairCode.attach(this._getSubElementId("PC"));
    this._pPairBy.attach(this._getSubElementId("PB"));
    this._pStatus.attach(this._getSubElementId("S"));
    this._pPairedAt.attach(this._getSubElementId("PA"));
  }
}

export default PSquareTerminal;
