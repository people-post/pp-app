
const _CPT_CUSTOMER_ORDER = {
  MAIN : `<div class="small-info-text">
    <div id="__ID_SHOP_NAME__"></div>
    <div id="__ID_ORDER_ID__"></div>
    <div id="__ID_T_CREATE__"></div>
    <div id="__ID_STATUS__"></div>
  </div>
  <div id="__ID_ITEMS__"></div>
  <div class="small-info-text right-align">
    <div id="__ID_SUBTOTAL__"></div>
    <div id="__ID_SHIPPING_HANDLING__"></div>
    <div id="__ID_DISCOUNT__"></div>
    <div id="__ID_REFUND__"></div>
    <div id="__ID_TOTAL__"></div>
  </div>
  <div id="__ID_SHIPPING_ADDRESS__"></div>`,
}

export class POrder extends cart.POrderBase {
  constructor() {
    super();
    this._pShopName = new ui.Panel();
    this._pOrderId = new ui.Panel();
    this._pCreationTime = new ui.Panel();
    this._pStatus = new ui.Panel();
    this._pItems = new ui.SectionPanel("Items");
    this._pSubtotal = new ui.Panel();
    this._pShippingHandling = new ui.Panel();
    this._pDiscount = new ui.Panel();
    this._pRefund = new ui.Panel();
    this._pTotal = new ui.Panel();
    this._pShippingAddress = new ui.PanelWrapper();
  }

  getShopNamePanel() { return this._pShopName; }
  getOrderIdPanel() { return this._pOrderId; }
  getCreationTimePanel() { return this._pCreationTime; }
  getStatusPanel() { return this._pStatus; }
  getItemsPanel() { return this._pItems.getContentPanel(); }
  getSubtotalPanel() { return this._pSubtotal; }
  getShippingHandlingPanel() { return this._pShippingHandling; }
  getDiscountPanel() { return this._pDiscount; }
  getRefundPanel() { return this._pRefund; }
  getTotalPanel() { return this._pTotal; }
  getShippingAddressPanel() { return this._pShippingAddress; }

  _renderFramework() {
    let s = _CPT_CUSTOMER_ORDER.MAIN;
    s = s.replace("__ID_SHOP_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ORDER_ID__", this._getSubElementId("O"));
    s = s.replace("__ID_T_CREATE__", this._getSubElementId("T"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    s = s.replace("__ID_ITEMS__", this._getSubElementId("I"));
    s = s.replace("__ID_SUBTOTAL__", this._getSubElementId("ST"));
    s = s.replace("__ID_SHIPPING_HANDLING__", this._getSubElementId("H"));
    s = s.replace("__ID_DISCOUNT__", this._getSubElementId("D"));
    s = s.replace("__ID_REFUND__", this._getSubElementId("R"));
    s = s.replace("__ID_TOTAL__", this._getSubElementId("TT"));
    s = s.replace("__ID_SHIPPING_ADDRESS__", this._getSubElementId("A"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pShopName.attach(this._getSubElementId("N"));
    this._pOrderId.attach(this._getSubElementId("O"));
    this._pCreationTime.attach(this._getSubElementId("T"));
    this._pStatus.attach(this._getSubElementId("S"));
    this._pItems.attach(this._getSubElementId("I"));
    this._pSubtotal.attach(this._getSubElementId("ST"));
    this._pShippingHandling.attach(this._getSubElementId("H"));
    this._pDiscount.attach(this._getSubElementId("D"));
    this._pRefund.attach(this._getSubElementId("R"));
    this._pTotal.attach(this._getSubElementId("TT"));
    this._pShippingAddress.attach(this._getSubElementId("A"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.POrder = POrder;
}
