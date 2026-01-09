
const _CPT_SERVICE_TIME_SLOT_EDITOR = {
  MAIN : `<div class="service-time-slot">
  <div id="__ID_FROM__"></div>
  <div id="__ID_TO__"></div>
  <div id="__ID_TOTAL__"></div>
  <div class="flex space-between">
    <div id="__ID_REPETITION__"></div>
    <div id="__ID_BTN_DELETE__"></div>
  </div>
  </div>`,
} as const;
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PServiceTimeslotEditor extends Panel {
  protected _pFrom: PanelWrapper;
  protected _pTo: PanelWrapper;
  protected _pTotal: PanelWrapper;
  protected _pRep: PanelWrapper;
  protected _pBtnDelete: PanelWrapper;

  constructor() {
    super();
    this._pFrom = new PanelWrapper();
    this._pTo = new PanelWrapper();
    this._pTotal = new PanelWrapper();
    this._pRep = new PanelWrapper();
    this._pBtnDelete = new PanelWrapper();
  }

  getFromPanel(): PanelWrapper { return this._pFrom; }
  getToPanel(): PanelWrapper { return this._pTo; }
  getTotalPanel(): PanelWrapper { return this._pTotal; }
  getRepetitionPanel(): PanelWrapper { return this._pRep; }
  getBtnDeletePanel(): PanelWrapper { return this._pBtnDelete; }

  _renderFramework(): string {
    let s = _CPT_SERVICE_TIME_SLOT_EDITOR.MAIN;
    s = s.replace("__ID_FROM__", this._getSubElementId("F"));
    s = s.replace("__ID_TO__", this._getSubElementId("T"));
    s = s.replace("__ID_TOTAL__", this._getSubElementId("TT"));
    s = s.replace("__ID_REPETITION__", this._getSubElementId("R"));
    s = s.replace("__ID_BTN_DELETE__", this._getSubElementId("B"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pFrom.attach(this._getSubElementId("F"));
    this._pTo.attach(this._getSubElementId("T"));
    this._pTotal.attach(this._getSubElementId("TT"));
    this._pRep.attach(this._getSubElementId("R"));
    this._pBtnDelete.attach(this._getSubElementId("B"));
  }
}
