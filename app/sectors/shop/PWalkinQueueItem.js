(function(shop) {
const _CPT_WALKIN_QUEUE_ITEM = {
  MAIN : `<div class="pad5px">
    <div id="__ID_STATUS__"></div>
    <br>
    <div id="__ID_NAME_DECOR__"></div>
    <div id="__ID_NAME__" class="s-font001 ellipsis center-align"></div>
    <br>
    <div id="__ID_AGENT__"></div>
    <br>
    <div class="flex space-around">
      <div id="__ID_ACTION1__"></div>
      <div id="__ID_ACTION2__"></div>
    </div>
  </div>`,
}

class PWalkinQueueItem extends shop.PWalkinQueueItemBase {
  constructor() {
    super();
    this._pStatus = new ui.PanelWrapper();
    this._pNameDecor = new ui.Panel();
    this._pActions = [ new ui.PanelWrapper(), new ui.PanelWrapper() ];
    this._pAgent = new ui.PanelWrapper();
  }

  getNameDecorPanel() { return this._pNameDecor; }
  getStatusPanel() { return this._pStatus; }
  getActionPanel(idx) { return this._pActions[idx]; }
  getAgentPanel() { return this._pAgent; }

  _renderFramework() {
    let s = _CPT_WALKIN_QUEUE_ITEM.MAIN;
    s = s.replace("__ID_NAME_DECOR__", this._getSubElementId("ND"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    s = s.replace("__ID_ACTION1__", this._getSubElementId("A1"));
    s = s.replace("__ID_ACTION2__", this._getSubElementId("A2"));
    s = s.replace("__ID_AGENT__", this._getSubElementId("G"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pNameDecor.attach(this._getSubElementId("ND"));
    this._pName.attach(this._getSubElementId("N"));
    this._pStatus.attach(this._getSubElementId("S"));
    this._pActions[0].attach(this._getSubElementId("A1"));
    this._pActions[1].attach(this._getSubElementId("A2"));
    this._pAgent.attach(this._getSubElementId("G"));
  }
};

shop.PWalkinQueueItem = PWalkinQueueItem;
}(window.shop = window.shop || {}));
