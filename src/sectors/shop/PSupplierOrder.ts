
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
} as const;

import { PSupplierOrderBase } from './PSupplierOrderBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PSupplierOrder extends PSupplierOrderBase {
  protected _pCustomerName: Panel;
  protected _pCreationTime: Panel;
  protected _pUpdateTime: Panel;
  protected _pStatus: Panel;
  protected _pItems: SectionPanel;
  protected _pExtraRefund: Panel;
  protected _pExtraPrice: Panel;
  protected _pSubtotal: Panel;
  protected _pShippingHandling: Panel;
  protected _pDiscount: Panel;
  protected _pRefund: Panel;
  protected _pTotal: Panel;
  protected _pShippingAddress: PanelWrapper;

  constructor() {
    super();
    this._pCustomerName = new Panel();
    this._pCreationTime = new Panel();
    this._pUpdateTime = new Panel();
    this._pStatus = new Panel();
    this._pItems = new SectionPanel("Items");
    this._pExtraRefund = new Panel();
    this._pExtraPrice = new Panel();
    this._pSubtotal = new Panel();
    this._pShippingHandling = new Panel();
    this._pDiscount = new Panel();
    this._pRefund = new Panel();
    this._pTotal = new Panel();
    this._pShippingAddress = new PanelWrapper();
  }

  getCustomerNamePanel(): Panel { return this._pCustomerName; }
  getCreationTimePanel(): Panel { return this._pCreationTime; }
  getUpdateTimePanel(): Panel { return this._pUpdateTime; }
  getStatusPanel(): Panel { return this._pStatus; }
  getItemsPanel(): Panel | null { return this._pItems.getContentPanel(); }
  getExtraPricePanel(): Panel { return this._pExtraPrice; }
  getExtraRefundPanel(): Panel { return this._pExtraRefund; }
  getSubtotalPanel(): Panel { return this._pSubtotal; }
  getShippingHandlingPanel(): Panel { return this._pShippingHandling; }
  getDiscountPanel(): Panel { return this._pDiscount; }
  getRefundPanel(): Panel { return this._pRefund; }
  getTotalPricePanel(): Panel { return this._pTotal; }
  getShippingAddressPanel(): PanelWrapper { return this._pShippingAddress; }

  _renderFramework(): string {
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

  _onFrameworkDidAppear(): void {
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
}
