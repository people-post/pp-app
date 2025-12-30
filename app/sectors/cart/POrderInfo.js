
const _CPT_CUSTOMER_ORDER_INFO = {
  MAIN : `<div class="customer-order-info">
    <div class="flex space-between">
      <div id="__ID_SELLER_INFO__"></div>
      <div id="__ID_STATUS_INFO__"></div>
      <div id="__ID_TIME_INFO__" class="small-info-text"></div>
    </div>
    <div id="__ID_ITEM_INFOS__"></div>
  <div>`,
}

export class POrderInfo extends cart.POrderBase {
  constructor() {
    super();
    this._pSellerInfo = new ui.Panel();
    this._pTimeInfo = new ui.Panel();
    this._pStatusInfo = new ui.Panel();
    this._pItemInfos = new ui.PanelWrapper();
  }

  getSellerInfoPanel() { return this._pSellerInfo; }
  getTimeInfoPanel() { return this._pTimeInfo; }
  getStatusInfoPanel() { return this._pStatusInfo; }
  getItemInfosPanel() { return this._pItemInfos; }

  _renderFramework() {
    let s = _CPT_CUSTOMER_ORDER_INFO.MAIN;
    s = s.replace("__ID_SELLER_INFO__", this._getSubElementId("SI"));
    s = s.replace("__ID_TIME_INFO__", this._getSubElementId("T"));
    s = s.replace("__ID_STATUS_INFO__", this._getSubElementId("S"));
    s = s.replace("__ID_ITEM_INFOS__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pSellerInfo.attach(this._getSubElementId("SI"));
    this._pTimeInfo.attach(this._getSubElementId("T"));
    this._pStatusInfo.attach(this._getSubElementId("S"));
    this._pItemInfos.attach(this._getSubElementId("I"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.POrderInfo = POrderInfo;
}
