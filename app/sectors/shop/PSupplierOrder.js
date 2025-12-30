
const _CPT_SUPPLIER_ORDER = {
  MAIN : `<div class="small-info-text">
    <div id="__ID_CUSTOMER_NAME__"></div>
    <div id="__ID_T_CREATE__"></div>
    <div id="__ID_T_UPDATE__"></div>
    <div id="__ID_STATUS__"></div>
  </div>
  <div id="__ID_ITEMS__"></div>
  <div id="__ID_EXTRA_PRICE__"></div>
  <div id="__ID_EXTRA_REFUND__"></div>
  <div class="small-info-text right-align">
    <div id="__ID_SUBTOTAL__"></div>
    <div id="__ID_SHIPPING_HANDLING__"></div>
    <div id="__ID_DISCOUNT__"></div>
    <div id="__ID_REFUND__"></div>
    <div id="__ID_TOTAL__"></div>
  </div>
  <div id="__ID_SHIPPING_ADDRESS__"></div>`,
}

export class PSupplierOrder extends shop.PSupplierOrderBase {
  constructor() {
    super();
    this._pCustomerName = new ui.Panel();
    this._pCreationTime = new ui.Panel();
    this._pUpdateTime = new ui.Panel();
    this._pStatus = new ui.Panel();
    this._pItems = new ui.SectionPanel("Items");
    this._pExtraRefund = new ui.Panel();
    this._pExtraPrice = new ui.Panel();
    this._pSubtotal = new ui.Panel();
    this._pShippingHandling = new ui.Panel();
    this._pDiscount = new ui.Panel();
    this._pRefund = new ui.Panel();
    this._pTotal = new ui.Panel();
    this._pShippingAddress = new ui.PanelWrapper();
  }

  getCustomerNamePanel() { return this._pCustomerName; }
  getCreationTimePanel() { return this._pCreationTime; }
  getUpdateTimePanel() { return this._pUpdateTime; }
  getStatusPanel() { return this._pStatus; }
  getItemsPanel() { return this._pItems.getContentPanel(); }
  getExtraPricePanel() { return this._pExtraPrice; }
  getExtraRefundPanel() { return this._pExtraRefund; }
  getSubtotalPanel() { return this._pSubtotal; }
  getShippingHandlingPanel() { return this._pShippingHandling; }
  getDiscountPanel() { return this._pDiscount; }
  getRefundPanel() { return this._pRefund; }
  getTotalPricePanel() { return this._pTotal; }
  getShippingAddressPanel() { return this._pShippingAddress; }

  _renderFramework() {
    let s = _CPT_SUPPLIER_ORDER.MAIN;
    s = s.replace("__ID_CUSTOMER_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_T_CREATE__", this._getSubElementId("T"));
    s = s.replace("__ID_T_UPDATE__", this._getSubElementId("U"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    s = s.replace("__ID_ITEMS__", this._getSubElementId("I"));
    s = s.replace("__ID_EXTRA_PRICE__", this._getSubElementId("EP"));
    s = s.replace("__ID_EXTRA_REFUND__", this._getSubElementId("ER"));
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
    this._pCustomerName.attach(this._getSubElementId("N"));
    this._pCreationTime.attach(this._getSubElementId("T"));
    this._pUpdateTime.attach(this._getSubElementId("U"));
    this._pStatus.attach(this._getSubElementId("S"));
    this._pItems.attach(this._getSubElementId("I"));
    this._pExtraPrice.attach(this._getSubElementId("EP"));
    this._pExtraRefund.attach(this._getSubElementId("ER"));
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
  window.shop = window.shop || {};
  window.shop.PSupplierOrder = PSupplierOrder;
}
