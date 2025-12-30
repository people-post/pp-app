
const _CPT_SERVICE_LOCATION = {
  MAIN : `<div id="__ID_MAIN__">
  <div class="bd1px bdsolid bdlightgray bdradius5px pad5px clickable">
    <div class="small-info-text" id="__ID_TIME_OVERHEAD__"></div>
    <div class="small-info-text" id="__ID_PRICE_OVERHEAD__"></div>
    <div id="__ID_TIMESLOTS__"></div>
    <div id="__ID_ADDRESS__"></div>
    <div id="__ID_BTN_VIEW_QUEUE__"></div>
  </div>
  </div>`,
}
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PServiceLocation extends Panel {
  constructor() {
    super();
    this._pTimeOverhead = new PanelWrapper();
    this._pPriceOverhead = new PanelWrapper();
    this._pTimeslots = new PanelWrapper();
    this._pAddress = new PanelWrapper();
    this._pBtnViewQueue = new PanelWrapper();
  }

  getTimeOverheadPanel() { return this._pTimeOverhead; }
  getPriceOverheadPanel() { return this._pPriceOverhead; }
  getTimeslotsPanel() { return this._pTimeslots; }
  getAddressPanel() { return this._pAddress; }
  getViewQueueBtnPanel() { return this._pBtnViewQueue; }

  invertColor() {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "s-cfuncbg s-csecondary";
    }
  }

  _renderFramework() {
    let s = _CPT_SERVICE_LOCATION.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_TIME_OVERHEAD__", this._getSubElementId("T"));
    s = s.replace("__ID_PRICE_OVERHEAD__", this._getSubElementId("P"));
    s = s.replace("__ID_TIMESLOTS__", this._getSubElementId("TS"));
    s = s.replace("__ID_ADDRESS__", this._getSubElementId("A"));
    s = s.replace("__ID_BTN_VIEW_QUEUE__", this._getSubElementId("Q"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pTimeOverhead.attach(this._getSubElementId("T"));
    this._pPriceOverhead.attach(this._getSubElementId("P"));
    this._pTimeslots.attach(this._getSubElementId("TS"));
    this._pAddress.attach(this._getSubElementId("A"));
    this._pBtnViewQueue.attach(this._getSubElementId("Q"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PServiceLocation = PServiceLocation;
}
