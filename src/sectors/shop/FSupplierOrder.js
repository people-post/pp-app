export const CF_SUPPLIER_ORDER = {
  SHOW_ADDRESS : Symbol(),
  ON_CLICK : Symbol(),
  USER_INFO : Symbol(),
};

const _CFT_SUPPLIER_ORDER = {
  ACT_ONCLICK : `javascript:G.action(shop.CF_SUPPLIER_ORDER.ON_CLICK)`,
  ADDERSS :
      `<span class="button-like small" onclick="javascript:G.action(shop.CF_SUPPLIER_ORDER.SHOW_ADDRESS)">Address</span>`,
  ITEM : `<div class="w60">__NAME__</div>
  <div>__QUANTITY__x</div>`,
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { STATE } from '../../common/constants/Constants.js';
import { Address } from '../../common/gui/Address.js';
export class FSupplierOrder extends Fragment {
  static T_LAYOUT = {
    FULL : Symbol(),
    INFO: Symbol(),
  };

  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this.setChild("items", this._fItems);

    this._fAddress = new Address();
    this._fAddress.setDataSource(this);
    this.setChild("address", this._fAddress);

    this._orderId = null;
    this._tLayout = null;
  }

  setOrderId(id) { this._orderId = id; }
  setLayoutType(t) { this._tLayout = t; }

  getDataForGuiAddress(fAddress, addressId) {
    return dba.Address.get(addressId);
  }

  action(type, ...args) {
    switch (type) {
    case shop.CF_SUPPLIER_ORDER.SHOW_ADDRESS:
      break;
    case shop.CF_SUPPLIER_ORDER.ON_CLICK:
      this.#onClick();
      break;
    case shop.CF_SUPPLIER_ORDER.USER_INFO:
      this.#showUserInfo(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILES:
    case plt.T_DATA.CURRENCIES:
    case plt.T_DATA.SUPPLIER_ORDER:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let order = dba.Shop.getOrder(this._orderId);
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
    let c = dba.Exchange.getCurrency(order.getCurrencyId());
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

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.FULL:
      p = new shop.PSupplierOrder();
      break;
    default:
      p = this.#createInfoPanel();
      break;
    }
    return p;
  }

  #createInfoPanel() { return new shop.PSupplierOrderInfo(); }

  #renderShippingAddressBtn(order, panel) {
    let addr = order.getShippingAddress();
    if (addr) {
      panel.replaceContent(_CFT_SUPPLIER_ORDER.ADDERSS);
    }
  }

  #renderShippingAddress(order, panel) {
    let p = new SectionPanel("Shipping address");
    panel.wrapPanel(p);
    this._fAddress.attachRender(p.getContentPanel());
    this._fAddress.render();
  }

  #renderItemInfos(order, panel) {
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

  #renderOrderItem(item) {
    let s = _CFT_SUPPLIER_ORDER.ITEM;
    s = s.replace("__NAME__", item.getDescription());
    s = s.replace("__QUANTITY__", item.getQuantity());
    return s;
  }

  #renderItems(order, panel) {
    this._fItems.clear();
    for (let item of order.getItems()) {
      let f = new shop.FSupplierOrderItem();
      f.setCurrencyId(order.getCurrencyId());
      f.setItem(item);
      this._fItems.append(f);
    }
    this._fItems.attachRender(panel);
    this._fItems.render();
  }

  #renderCustomerName(order, panel) {
    let s = "Customer: ";
    s += this.#renderUserName(order.getCustomerId());
    panel.replaceContent(s);
  }

  #renderCreationTime(order, panel) {
    let s = "Placed at: ";
    s +=
        ext.Utilities.timestampToDateTimeString(order.getCreationTime() / 1000);
    panel.replaceContent(s);
  }

  #renderTimeInfo(order, panel) {
    let s = "Updated ";
    if (order.getState() == STATE.FINISHED) {
      s = "Closed ";
    }
    s += Utilities.renderTimeDiff(order.getUpdateTime());
    s += " ago";
    panel.replaceContent(s);
  }

  #renderUpdateTime(order, panel) {
    let s = "Last update: ";
    s += ext.Utilities.timestampToDateTimeString(order.getUpdateTime() / 1000);
    panel.replaceContent(s);
  }

  #renderStatusInfo(order, panel) {
    let s = Utilities.renderStatus(order.getState(), order.getStatus());
    panel.replaceContent(s);
  }

  #renderStatus(order, panel) {
    let s = "Status: ";
    s += Utilities.renderStatus(order.getState(), order.getStatus());
    panel.replaceContent(s);
  }

  #renderUserName(userId) {
    let nickname = dba.Account.getUserNickname(userId, "...");
    return Utilities.renderSmallButton(
        "shop.CF_SUPPLIER_ORDER_CONTENT.USER_INFO", userId, nickname,
        "low-profile s-cinfotext bold");
  }

  #renderExtraPrice(currency, value, panel) {
    let s = "Shipping&handling(+): ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderExtraRefund(currency, value, panel) {
    let s = "Refund(-): ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderSubtotal(currency, value, panel) {
    let s = "Subtotal: ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderShippingHandling(currency, value, panel) {
    let s = "Shipping&handling(+): ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderDiscount(currency, value, panel) {
    let s = "Discount(-): ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderRefund(currency, value, panel) {
    let s = "Refund(-): ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderTotalInfo(currency, value, panel) {
    let s = Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderTotal(currency, value, panel) {
    let s = "Total: ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #onClick() {
    if (this._delegate) {
      this._delegate.onSupplierOrderFragmentRequestShowOrder(this,
                                                             this._orderId);
    }
  }

  #showUserInfo(userId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.CF_SUPPLIER_ORDER = CF_SUPPLIER_ORDER;
}