
const _CPT_WALKIN_QUEUE_ITEM_INFO_PUBLIC = {
  MAIN : `<div class="pad5px">
    <div class="flex space-between bd-b-1px bd-b-solid bdlightgray">
      <div id="__ID_NAME__" class="s-font001 ellipsis"></div>
      <div id="__ID_STATUS__"></div>
    </div>
  </div>`,
}

class PWalkinQueueItemInfoPublic extends shop.PWalkinQueueItemBase {
  constructor() {
    super();
    this._pStatus = new ui.PanelWrapper();
  }

  getStatusPanel() { return this._pStatus; }

  _renderFramework() {
    let s = _CPT_WALKIN_QUEUE_ITEM_INFO_PUBLIC.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pStatus.attach(this._getSubElementId("S"));
  }
};

shop.PWalkinQueueItemInfoPublic = PWalkinQueueItemInfoPublic;
}(window.shop = window.shop || {}));
