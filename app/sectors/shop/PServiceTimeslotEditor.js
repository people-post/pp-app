(function(shop) {
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
}

class PServiceTimeslotEditor extends ui.Panel {
  constructor() {
    super();
    this._pFrom = new ui.PanelWrapper();
    this._pTo = new ui.PanelWrapper();
    this._pTotal = new ui.PanelWrapper();
    this._pRep = new ui.PanelWrapper();
    this._pBtnDelete = new ui.PanelWrapper();
  }

  getFromPanel() { return this._pFrom; }
  getToPanel() { return this._pTo; }
  getTotalPanel() { return this._pTotal; }
  getRepetitionPanel() { return this._pRep; }
  getBtnDeletePanel() { return this._pBtnDelete; }

  _renderFramework() {
    let s = _CPT_SERVICE_TIME_SLOT_EDITOR.MAIN;
    s = s.replace("__ID_FROM__", this._getSubElementId("F"));
    s = s.replace("__ID_TO__", this._getSubElementId("T"));
    s = s.replace("__ID_TOTAL__", this._getSubElementId("TT"));
    s = s.replace("__ID_REPETITION__", this._getSubElementId("R"));
    s = s.replace("__ID_BTN_DELETE__", this._getSubElementId("B"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pFrom.attach(this._getSubElementId("F"));
    this._pTo.attach(this._getSubElementId("T"));
    this._pTotal.attach(this._getSubElementId("TT"));
    this._pRep.attach(this._getSubElementId("R"));
    this._pBtnDelete.attach(this._getSubElementId("B"));
  }
};

shop.PServiceTimeslotEditor = PServiceTimeslotEditor;
}(window.shop = window.shop || {}));

