
const _CPT_SUPPLIER_ORDER_INFO = {
  MAIN : `<div class="supplier-order-info">
    <div class="flex space-between">
      <div id="__ID_STATUS_INFO__"></div>
      <div id="__ID_PRICE__"></div>
      <div id="__ID_ADDRESS_BTN__"></div>
      <div id="__ID_TIME_INFO__" class="small-info-text"></div>
    </div>
    <div id="__ID_ITEM_INFOS__"></div>
  </div>`,
}

class PSupplierOrderInfo extends shop.PSupplierOrderBase {
  constructor() {
    super();
    this._pAddressBtn = new ui.Panel();
    this._pStatusInfo = new ui.Panel();
    this._pTimeInfo = new ui.Panel();
    this._pItemInfos = new ui.PanelWrapper();
    this._pTotalPriceInfo = new ui.Panel();
  }

  getShippingAddressBtnPanel() { return this._pAddressBtn; }
  getStatusInfoPanel() { return this._pStatusInfo; }
  getTimeInfoPanel() { return this._pTimeInfo; }
  getItemInfosPanel() { return this._pItemInfos; }
  getTotalPriceInfoPanel() { return this._pTotalPriceInfo; }

  _renderFramework() {
    let s = _CPT_SUPPLIER_ORDER_INFO.MAIN;
    s = s.replace("__ID_ADDRESS_BTN__", this._getSubElementId("A"));
    s = s.replace("__ID_STATUS_INFO__", this._getSubElementId("S"));
    s = s.replace("__ID_PRICE__", this._getSubElementId("P"));
    s = s.replace("__ID_TIME_INFO__", this._getSubElementId("T"));
    s = s.replace("__ID_ITEM_INFOS__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pAddressBtn.attach(this._getSubElementId("A"));
    this._pStatusInfo.attach(this._getSubElementId("S"));
    this._pTotalPriceInfo.attach(this._getSubElementId("P"));
    this._pTimeInfo.attach(this._getSubElementId("T"));
    this._pItemInfos.attach(this._getSubElementId("I"));
  }
};

shop.PSupplierOrderInfo = PSupplierOrderInfo;
}(window.shop = window.shop || {}));
