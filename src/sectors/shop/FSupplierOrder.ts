export const CF_SUPPLIER_ORDER = {
  SHOW_ADDRESS : "CF_SUPPLIER_ORDER_1",
  ON_CLICK : "CF_SUPPLIER_ORDER_2",
  USER_INFO : "CF_SUPPLIER_ORDER_3",
};

const _CFT_SUPPLIER_ORDER = {
  ACT_ONCLICK : `javascript:G.action('${CF_SUPPLIER_ORDER.ON_CLICK}')`,
  ADDERSS :
      `<span class="button-like small" onclick="javascript:G.action('${CF_SUPPLIER_ORDER.SHOW_ADDRESS}')">Address</span>`,
  ITEM : `<div class="w60">__NAME__</div>
  <div>__QUANTITY__x</div>`,
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { STATE } from '../../common/constants/Constants.js';
import { Address as GuiAddress } from '../../common/gui/Address.js';
import { PSupplierOrder } from './PSupplierOrder.js';
import { PSupplierOrderInfo } from './PSupplierOrderInfo.js';
import { FSupplierOrderItem } from './FSupplierOrderItem.js';
import { Shop } from '../../common/dba/Shop.js';
import { Address } from '../../common/dba/Address.js';
import { Exchange } from '../../common/dba/Exchange.js';
import { T_DATA } from '../../common/plt/Events.js';
import { T_ACTION } from '../../common/plt/Events.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { Utilities } from '../../common/Utilities.js';
import { Events } from '../../lib/framework/Events.js';
import { SupplierOrderPrivate } from '../../common/datatypes/SupplierOrderPrivate.js';
import { Currency } from '../../common/datatypes/Currency.js';
import { Account } from '../../common/dba/Account.js';
import { PSupplierOrderBase } from './PSupplierOrderBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export interface SupplierOrderDelegate {
  onSupplierOrderFragmentRequestShowOrder(f: FSupplierOrder, orderId: string | null): void;
}

export class FSupplierOrder extends Fragment {
  static T_LAYOUT = {
    FULL : Symbol(),
    INFO: Symbol(),
  } as const;

  protected _fItems: FSimpleFragmentList;
  protected _fAddress: GuiAddress;
  protected _orderId: string | null = null;
  protected _tLayout: symbol | null = null;

  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this.setChild("items", this._fItems);

    this._fAddress = new GuiAddress();
    this._fAddress.setDataSource(this);
    this.setChild("address", this._fAddress);
  }

  setOrderId(id: string | null): void { this._orderId = id; }
  setLayoutType(t: symbol | null): void { this._tLayout = t; }

  getDataForGuiAddress(_fAddress: GuiAddress, addressId: string): any {
    return Address.get(addressId);
  }

  action(type: symbol | string, ...args: unknown[]): void {
    switch (type) {
    case CF_SUPPLIER_ORDER.SHOW_ADDRESS:
      break;
    case CF_SUPPLIER_ORDER.ON_CLICK:
      this.#onClick();
      break;
    case CF_SUPPLIER_ORDER.USER_INFO:
      this.#showUserInfo(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, _data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
    case T_DATA.CURRENCIES:
    case T_DATA.SUPPLIER_ORDER:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, _data);
  }

  _renderOnRender(render: PanelWrapper): void {
    let order = Shop.getOrder(this._orderId);
    if (!order) {
      return;
    }

    let pMain = this.#createPanel();
    render.wrapPanel(pMain);

    // Header
    let p = pMain.getCustomerNamePanel();
    if (p) {
      this.#renderCustomerName(order, p);
    }

    p = pMain.getCreationTimePanel();
    if (p) {
      this.#renderCreationTime(order, p);
    }

    p = pMain.getTimeInfoPanel();
    if (p) {
      this.#renderTimeInfo(order, p);
    }

    p = pMain.getUpdateTimePanel();
    if (p) {
      this.#renderUpdateTime(order, p);
    }

    p = pMain.getStatusInfoPanel();
    if (p) {
      this.#renderStatusInfo(order, p);
    }

    p = pMain.getStatusPanel();
    if (p) {
      this.#renderStatus(order, p);
    }

    p = pMain.getShippingAddressBtnPanel();
    if (p) {
      this.#renderShippingAddressBtn(order, p);
    }

    p = pMain.getShippingAddressPanel();
    if (p) {
      this.#renderShippingAddress(order, p);
    }

    p = pMain.getItemInfosPanel();
    if (p) {
      this.#renderItemInfos(order, p);
    }

    p = pMain.getItemsPanel();
    if (p) {
      this.#renderItems(order, p);
    }

    // Price Summary
    let c = Exchange.getCurrency(order.getCurrencyId());
    if (!c) {
      return;
    }

    p = pMain.getExtraPricePanel();
    if (p) {
      this.#renderExtraPrice(c, order.getExtraPrice(), p);
    }

    p = pMain.getExtraRefundPanel();
    if (p) {
      this.#renderExtraRefund(c, order.getExtraRefund(), p);
    }

    p = pMain.getSubtotalPanel();
    if (p) {
      this.#renderSubtotal(c, order.getSubtotal(), p);
    }

    p = pMain.getShippingHandlingPanel();
    if (p) {
      this.#renderShippingHandling(c, order.getShippingHandlingCost(), p);
    }

    p = pMain.getDiscountPanel();
    if (p) {
      this.#renderDiscount(c, order.getDiscount(), p);
    }

    p = pMain.getRefundPanel();
    if (p) {
      this.#renderRefund(c, order.getRefund(), p);
    }

    p = pMain.getTotalPricePanel();
    if (p) {
      this.#renderTotal(c, order.getTotal(), p);
    }

    p = pMain.getTotalPriceInfoPanel();
    if (p) {
      this.#renderTotalInfo(c, order.getTotal(), p);
    }
  }

  #createPanel(): PSupplierOrderBase {
    let p: PSupplierOrderBase;
    switch (this._tLayout) {
    case FSupplierOrder.T_LAYOUT.FULL:
      p = new PSupplierOrder();
      break;
    default:
      p = this.#createInfoPanel();
      break;
    }
    return p;
  }

  #createInfoPanel(): Panel { return new PSupplierOrderInfo(); }

  #renderShippingAddressBtn(order: SupplierOrderPrivate, panel: Panel): void {
    let addr = order.getShippingAddress();
    if (addr) {
      panel.replaceContent(_CFT_SUPPLIER_ORDER.ADDERSS);
    }
  }

  #renderShippingAddress(order: SupplierOrderPrivate, panel: Panel): void {
    let p = new SectionPanel("Shipping address");
    panel.wrapPanel(p);
    this._fAddress.attachRender(p.getContentPanel()!);
    this._fAddress.render();
  }

  #renderItemInfos(order: SupplierOrderPrivate, panel: Panel): void {
    let pItems = new ListPanel();
    pItems.setClassName("clickable");
    pItems.setAttribute("onclick", _CFT_SUPPLIER_ORDER.ACT_ONCLICK);
    panel.wrapPanel(pItems);
    for (let item of order.getItems()) {
      let p = new Panel();
      p.setClassName("supplier-order-info-item flex space-between");
      pItems.pushPanel(p);
      p.replaceContent(this.#renderOrderItem(item));
    }
  }

  #renderOrderItem(item: any): string {
    let s = _CFT_SUPPLIER_ORDER.ITEM;
    s = s.replace("__NAME__", item.getDescription());
    s = s.replace("__QUANTITY__", String(item.getQuantity()));
    return s;
  }

  #renderItems(order: SupplierOrderPrivate, panel: Panel): void {
    this._fItems.clear();
    for (let item of order.getItems()) {
      let f = new FSupplierOrderItem();
      f.setCurrencyId(order.getCurrencyId());
      f.setItem(item);
      this._fItems.append(f);
    }
    this._fItems.attachRender(panel);
    this._fItems.render();
  }

  #renderCustomerName(order: SupplierOrderPrivate, panel: Panel): void {
    let s = "Customer: ";
    s += this.#renderUserName(order.getCustomerId()!);
    panel.replaceContent(s);
  }

  #renderCreationTime(order: SupplierOrderPrivate, panel: Panel): void {
    let s = "Placed at: ";
    s +=
        UtilitiesExt.timestampToDateTimeString(order.getCreationTime() / 1000);
    panel.replaceContent(s);
  }

  #renderTimeInfo(order: SupplierOrderPrivate, panel: Panel): void {
    let s = "Updated ";
    if (order.getState() == STATE.FINISHED) {
      s = "Closed ";
    }
    s += Utilities.renderTimeDiff(order.getUpdateTime());
    s += " ago";
    panel.replaceContent(s);
  }

  #renderUpdateTime(order: SupplierOrderPrivate, panel: Panel): void {
    let s = "Last update: ";
    s += UtilitiesExt.timestampToDateTimeString(order.getUpdateTime() / 1000);
    panel.replaceContent(s);
  }

  #renderStatusInfo(order: SupplierOrderPrivate, panel: Panel): void {
    let s = Utilities.renderStatus(order.getState(), order.getStatus());
    panel.replaceContent(s);
  }

  #renderStatus(order: SupplierOrderPrivate, panel: Panel): void {
    let s = "Status: ";
    s += Utilities.renderStatus(order.getState(), order.getStatus());
    panel.replaceContent(s);
  }

  #renderUserName(userId: string): string {
    let nickname = Account.getUserNickname(userId, "...");
    return Utilities.renderSmallButton(
        CF_SUPPLIER_ORDER.USER_INFO, userId, nickname,
        "low-profile s-cinfotext bold");
  }

  #renderExtraPrice(currency: Currency, value: number, panel: Panel): void {
    let s = "Shipping&handling(+): ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderExtraRefund(currency: Currency, value: number, panel: Panel): void {
    let s = "Refund(-): ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderSubtotal(currency: Currency, value: number, panel: Panel): void {
    let s = "Subtotal: ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderShippingHandling(currency: Currency, value: number, panel: Panel): void {
    let s = "Shipping&handling(+): ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderDiscount(currency: Currency, value: number, panel: Panel): void {
    let s = "Discount(-): ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderRefund(currency: Currency, value: number, panel: Panel): void {
    let s = "Refund(-): ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderTotalInfo(currency: Currency, value: number, panel: Panel): void {
    let s = Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderTotal(currency: Currency, value: number, panel: Panel): void {
    let s = "Total: ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #onClick(): void {
    if (this._delegate) {
      this._delegate.onSupplierOrderFragmentRequestShowOrder(this,
                                                             this._orderId);
    }
  }

  #showUserInfo(userId: string): void {
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }
}
