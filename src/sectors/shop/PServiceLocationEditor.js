
const _CPT_SERVICE_LOCATION_EDITOR = {
  MAIN : `<div>
  <div id="__ID_TIME_OVERHEAD__"></div>
  <div id="__ID_PRICE_OVERHEAD__"></div>
  <div id="__ID_TIME_SLOTS__"></div>
  <div id="__ID_LOCATIONS__"></div>
  <br>
  <div id="__ID_BTN_ADD__"></div>
  </div>`,
}
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PServiceLocationEditor extends Panel {
  constructor() {
    super();
    this._pTimeOverhead = new PanelWrapper();
    this._pPriceOverhead = new PanelWrapper();
    this._pTimeslots = new PanelWrapper();
    this._pLocations = new PanelWrapper();
    this._pBtnAdd = new PanelWrapper();
  }

  getTimeOverheadPanel() { return this._pTimeOverhead; }
  getPriceOverheadPanel() { return this._pPriceOverhead; }
  getTimeslotsPanel() { return this._pTimeslots; }
  getLocationsPanel() { return this._pLocations; }
  getBtnAddPanel() { return this._pBtnAdd; }

  _renderFramework() {
    let s = _CPT_SERVICE_LOCATION_EDITOR.MAIN;
    s = s.replace("__ID_TIME_OVERHEAD__", this._getSubElementId("T"));
    s = s.replace("__ID_PRICE_OVERHEAD__", this._getSubElementId("P"));
    s = s.replace("__ID_TIME_SLOTS__", this._getSubElementId("TS"));
    s = s.replace("__ID_LOCATIONS__", this._getSubElementId("L"));
    s = s.replace("__ID_BTN_ADD__", this._getSubElementId("B"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pTimeOverhead.attach(this._getSubElementId("T"));
    this._pPriceOverhead.attach(this._getSubElementId("P"));
    this._pTimeslots.attach(this._getSubElementId("TS"));
    this._pLocations.attach(this._getSubElementId("L"));
    this._pBtnAdd.attach(this._getSubElementId("B"));
  }
};
