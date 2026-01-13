export const CF_CUSTOMER_ORDER = {
  ON_CLICK : "CF_CUSTOMER_ORDER_1",
  USER_INFO : "CF_CUSTOMER_ORDER_2",
};

const _CFT_CUSTOMER_ORDER = {
  T_UPDATE : `Updated __DT__ ago`,
  T_CREATE : `Created __DT__ ago`,
  ITEM : `<div class="w60">__NAME__</div>
  <div>__QUANTITY__x</div>`,
  ACT_ONCLICK : `javascript:G.action("${CF_CUSTOMER_ORDER.ON_CLICK}")`,
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Exchange } from '../../common/dba/Exchange.js';
import { T_DATA } from '../../common/plt/Events.js';
import { STATE } from '../../common/constants/Constants.js';
import { Utilities } from '../../common/Utilities.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { T_ACTION as PltT_ACTION } from '../../common/plt/Events.js';
import { POrder } from './POrder.js';
import { POrderInfo } from './POrderInfo.js';
import { FOrderItem } from './FOrderItem.js';
import { CustomerOrder } from '../../common/datatypes/CustomerOrder.js';
import { SupplierOrderPublic } from '../../common/datatypes/SupplierOrderPublic.js';
import { Currency } from '../../common/datatypes/Currency.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';
import type { POrderBase } from './POrderBase.js';
import { Account } from '../../common/dba/Account.js';

export interface OrderDataSource {
  getOrderForOrderFragment(f: FOrder, orderId: string | null): CustomerOrder | null;
}

export interface OrderDelegate {
  onCustomerOrderInfoFragmentRequestShowOrder(f: FOrder, orderId: string | null): void;
}

export class FOrder extends Fragment {
  static T_LAYOUT = {
    FULL : Symbol(),
    INFO: Symbol(),
  };

  protected _fItems: FSimpleFragmentList;
  protected _orderId: string | null;
  protected _tLayout: symbol | null;

  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this.setChild("items", this._fItems);

    this._orderId = null;
    this._tLayout = null;
  }

  setOrderId(id: string | null): void { this._orderId = id; }
  setLayoutType(t: symbol | null): void { this._tLayout = t; }

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_CUSTOMER_ORDER.ON_CLICK:
      this.#onClick();
      break;
    case CF_CUSTOMER_ORDER.USER_INFO:
      this.#showUserInfo(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
    case T_DATA.CURRENCIES:
    case T_DATA.CUSTOMER_ORDER:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    let order = Account.getOrder(this._orderId);
    if (!order) {
      return;
    }
    let pMain = this.#createPanel();
    render.wrapPanel(pMain);

    // Header
    let p: Panel | SectionPanel | null = pMain.getShopNamePanel();
    if (p) {
      this.#renderShopName(order, p);
    }

    p = pMain.getOrderIdPanel();
    if (p) {
      this.#renderOrderId(order, p);
    }

    p = pMain.getCreationTimePanel();
    if (p) {
      this.#renderCreationTime(order, p);
    }

    p = pMain.getStatusPanel();
    if (p) {
      this.#renderStatus(order, p);
    }

    //
    p = pMain.getItemsPanel();
    if (p) {
      this.#renderItems(order, p);
    }

    let c = Exchange.getCurrency(order.getCurrencyId());
    if (!c) {
      return;
    }

    // Price summary
    p = pMain.getSubtotalPanel();
    if (p) {
      this.#renderSubtotal(c, order.getSubtotal() || 0, p);
    }

    p = pMain.getShippingHandlingPanel();
    if (p) {
      this.#renderShippingHandling(c, order.getShippingHandlingCost() || 0, p);
    }

    p = pMain.getDiscountPanel();
    if (p) {
      this.#renderDiscount(c, order.getDiscount() || 0, p);
    }

    p = pMain.getRefundPanel();
    if (p) {
      this.#renderRefund(c, order.getRefund() || 0, p);
    }

    p = pMain.getTotalPanel();
    if (p) {
      this.#renderTotal(c, order.getTotalPrice() || 0, p);
    }

    // Shipping
    p = pMain.getShippingAddressPanel();
    if (p) {
      this.#renderShippingAddress(order, p);
    }

    p = pMain.getTimeInfoPanel();
    if (p) {
      this.#renderTimeInfo(order, p);
    }

    p = pMain.getSellerInfoPanel();
    if (p) {
      this.#renderShopNameInfo(order, p);
    }

    p = pMain.getStatusInfoPanel();
    if (p) {
      this.#renderStatusInfo(order, p);
    }

    p = pMain.getItemInfosPanel();
    if (p) {
      this.#renderItemInfos(order, p);
    }
  }

  #createPanel(): POrderBase {
    let p: POrderBase;
    switch (this._tLayout) {
    case FOrder.T_LAYOUT.FULL:
      p = new POrder();
      break;
    default:
      p = this.#createInfoPanel();
      break;
    }
    return p;
  }

  #createInfoPanel(): POrderInfo { return new POrderInfo(); }

  #renderTimeInfo(order: CustomerOrder, panel: Panel): void {
    let s = "";
    if (order.getState() == STATE.ACTIVE) {
      s = _CFT_CUSTOMER_ORDER.T_UPDATE;
      s = s.replace("__DT__", Utilities.renderTimeDiff(order.getUpdateTime()));
    } else {
      s = _CFT_CUSTOMER_ORDER.T_CREATE;
      s = s.replace("__DT__",
                    Utilities.renderTimeDiff(order.getCreationTime()));
    }
    panel.replaceContent(s);
  }

  #renderOrderItem(item: SupplierOrderPublic): string {
    let s = _CFT_CUSTOMER_ORDER.ITEM;
    s = s.replace("__NAME__", item.getDescription());
    s = s.replace("__QUANTITY__", item.getQuantity().toString());
    return s;
  }

  #renderShopNameInfo(order: CustomerOrder, panel: Panel): void {
    let userId = order.getShopId();
    let name = Account.getUserShopName(userId, "...");
    let s =
        Utilities.renderSmallButton(CF_CUSTOMER_ORDER.USER_INFO, userId,
                                    name, "low-profile s-cinfotext bold");
    panel.replaceContent(s);
  }

  #renderShopName(order: CustomerOrder, panel: Panel): void {
    let userId = order.getShopId();
    let name = Account.getUserShopName(userId, "...");
    let s = "Shop: ";
    s += Utilities.renderSmallButton(CF_CUSTOMER_ORDER.USER_INFO, userId,
                                     name, "low-profile s-cinfotext bold");
    panel.replaceContent(s);
  }

  #renderOrderId(order: CustomerOrder, panel: Panel): void {
    let s = "Order id: ";
    s += Utilities.orderIdToReferenceId(order.getId());
    panel.replaceContent(s);
  }

  #renderCreationTime(order: CustomerOrder, panel: Panel): void {
    let s = "Created at: ";
    s +=
        UtilitiesExt.timestampToDateTimeString(order.getCreationTime() / 1000);
    panel.replaceContent(s);
  }

  #renderStatusInfo(order: CustomerOrder, panel: Panel): void {
    let s = Utilities.renderStatus(order.getState(), order.getStatus());
    panel.replaceContent(s);
  }

  #renderStatus(order: CustomerOrder, panel: Panel): void {
    let s = "Status: ";
    s += Utilities.renderStatus(order.getState(), order.getStatus());
    panel.replaceContent(s);
  }

  #renderItemInfos(order: CustomerOrder, panel: Panel): void {
    let pItems = new ListPanel();
    pItems.setClassName("clickable");
    pItems.setAttribute("onclick", _CFT_CUSTOMER_ORDER.ACT_ONCLICK);
    panel.wrapPanel(pItems);
    for (let item of order.getItems()) {
      for (let subItem of item.getItems()) {
        let p = new Panel();
        p.setClassName("flex space-between");
        pItems.pushPanel(p);
        p.replaceContent(this.#renderOrderItem(subItem));
      }
    }
  }

  #renderItems(order: CustomerOrder, panel: Panel): void {
    this._fItems.clear();
    for (let item of order.getItems()) {
      let f = new FOrderItem();
      f.setItem(item);
      this._fItems.append(f);
    }
    this._fItems.attachRender(panel);
    this._fItems.render();
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

  #renderTotal(currency: Currency, value: number, panel: Panel): void {
    let s = "Total: ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderShippingAddress(order: CustomerOrder, panel: Panel): void {
    let addr = order.getShippingAddress();
    if (addr) {
      let p = new SectionPanel("Shipping address");
      panel.wrapPanel(p);
      p = p.getContentPanel();
      if (p) {
        p.replaceContent((addr as { data?: string }).data || "");
      }
    }
  }

  #onClick(): void {
    this._delegate.onCustomerOrderInfoFragmentRequestShowOrder(this,
                                                               this._orderId);
  }

  #showUserInfo(userId: string): void {
    Events.triggerTopAction(PltT_ACTION.SHOW_USER_INFO, userId);
  }
};
