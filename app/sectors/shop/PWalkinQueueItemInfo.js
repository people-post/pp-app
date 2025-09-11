(function(shop) {
const _CPT_WALKIN_QUEUE_ITEM_INFO = {
  MAIN : `<div class="pad5px clickable">
    <div id="__ID_MAIN__" class="flex space-between bd-b-1px bd-b-solid bdlightgray">
      <div id="__ID_NAME__" class="s-font001 ellipsis"></div>
      <div id="__ID_STATUS__"></div>
      <div id="__ID_ACTION__"></div>
    </div>
  </div>`,
}

class PWalkinQueueItemInfo extends shop.PWalkinQueueItemBase {
  constructor() {
    super();
    this._pStatus = new ui.PanelWrapper();
    this._pActions = [ new ui.PanelWrapper() ];
  }

  getStatusPanel() { return this._pStatus; }
  getActionPanel(idx) { return this._pActions[idx]; }

  invertColor() {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = e.className.replace("bdlightgray", "s-cprimebd");
    }
  }

  _renderFramework() {
    let s = _CPT_WALKIN_QUEUE_ITEM_INFO.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    s = s.replace("__ID_ACTION__", this._getSubElementId("A"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pStatus.attach(this._getSubElementId("S"));
    this._pActions[0].attach(this._getSubElementId("A"));
  }
};

shop.PWalkinQueueItemInfo = PWalkinQueueItemInfo;
}(window.shop = window.shop || {}));
