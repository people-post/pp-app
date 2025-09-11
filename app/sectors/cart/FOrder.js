(function(cart) {
cart.CF_CUSTOMER_ORDER = {
  ON_CLICK : Symbol(),
  USER_INFO : Symbol(),
};

const _CFT_CUSTOMER_ORDER = {
  T_UPDATE : `Updated __DT__ ago`,
  T_CREATE : `Created __DT__ ago`,
  ITEM : `<div class="w60">__NAME__</div>
  <div>__QUANTITY__x</div>`,
  ACT_ONCLICK : `javascript:G.action(cart.CF_CUSTOMER_ORDER.ON_CLICK)`,
};

class FOrder extends ui.Fragment {
  static T_LAYOUT = {
    FULL : Symbol(),
    INFO: Symbol(),
  };

  constructor() {
    super();
    this._fItems = new ui.FSimpleFragmentList();
    this.setChild("items", this._fItems);

    this._orderId = null;
    this._tLayout = null;
  }

  setOrderId(id) { this._orderId = id; }
  setLayoutType(t) { this._tLayout = t; }

  action(type, ...args) {
    switch (type) {
    case cart.CF_CUSTOMER_ORDER.ON_CLICK:
      this.#onClick();
      break;
    case cart.CF_CUSTOMER_ORDER.USER_INFO:
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
    case plt.T_DATA.CUSTOMER_ORDER:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let order = dba.Account.getOrder(this._orderId);
    if (!order) {
      return;
    }
    let pMain = this.#createPanel();
    render.wrapPanel(pMain);

    // Header
    let p = pMain.getShopNamePanel();
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

    let c = dba.Exchange.getCurrency(order.getCurrencyId());
    if (!c) {
      return;
    }

    // Price summary
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

    p = pMain.getTotalPanel();
    if (p) {
      this.#renderTotal(c, order.getTotalPrice(), p);
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

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.FULL:
      p = new cart.POrder();
      break;
    default:
      p = this.#createInfoPanel();
      break;
    }
    return p;
  }

  #createInfoPanel() { return new cart.POrderInfo(); }

  #renderTimeInfo(order, panel) {
    let s = "";
    if (order.getState() == C.STATE.ACTIVE) {
      s = _CFT_CUSTOMER_ORDER.T_UPDATE;
      s = s.replace("__DT__", Utilities.renderTimeDiff(order.getUpdateTime()));
    } else {
      s = _CFT_CUSTOMER_ORDER.T_CREATE;
      s = s.replace("__DT__",
                    Utilities.renderTimeDiff(order.getCreationTime()));
    }
    panel.replaceContent(s);
  }

  #renderOrderItem(item) {
    let s = _CFT_CUSTOMER_ORDER.ITEM;
    s = s.replace("__NAME__", item.getDescription());
    s = s.replace("__QUANTITY__", item.getQuantity());
    return s;
  }

  #renderShopNameInfo(order, panel) {
    let userId = order.getShopId();
    let name = dba.Account.getUserShopName(userId, "...");
    let s =
        Utilities.renderSmallButton("cart.CF_CUSTOMER_ORDER.USER_INFO", userId,
                                    name, "low-profile s-cinfotext bold");
    panel.replaceContent(s);
  }

  #renderShopName(order, panel) {
    let userId = order.getShopId();
    let name = dba.Account.getUserShopName(userId, "...");
    let s = "Shop: ";
    s += Utilities.renderSmallButton("cart.CF_CUSTOMER_ORDER.USER_INFO", userId,
                                     name, "low-profile s-cinfotext bold");
    panel.replaceContent(s);
  }

  #renderOrderId(order, panel) {
    let s = "Order id: ";
    s += Utilities.orderIdToReferenceId(order.getId());
    panel.replaceContent(s);
  }

  #renderCreationTime(order, panel) {
    let s = "Created at: ";
    s +=
        ext.Utilities.timestampToDateTimeString(order.getCreationTime() / 1000);
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

  #renderItemInfos(order, panel) {
    let pItems = new ui.ListPanel();
    pItems.setClassName("clickable");
    pItems.setAttribute("onclick", _CFT_CUSTOMER_ORDER.ACT_ONCLICK);
    panel.wrapPanel(pItems);
    for (let item of order.getItems()) {
      for (let subItem of item.getItems()) {
        let p = new ui.Panel();
        p.setClassName("customer-order-info-item flex space-between");
        pItems.pushPanel(p);
        p.replaceContent(this.#renderOrderItem(subItem));
      }
    }
  }

  #renderItems(order, panel) {
    this._fItems.clear();
    for (let item of order.getItems()) {
      let f = new cart.FOrderItem();
      f.setItem(item);
      this._fItems.append(f);
    }
    this._fItems.attachRender(panel);
    this._fItems.render();
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

  #renderTotal(currency, value, panel) {
    let s = "Total: ";
    s += Utilities.renderPrice(currency, value);
    panel.replaceContent(s);
  }

  #renderShippingAddress(order, panel) {
    let addr = order.getShippingAddress();
    if (addr) {
      let p = new ui.SectionPanel("Shipping address");
      panel.wrapPanel(p);
      p = p.getContentPanel();
      p.replaceContent(addr.data);
    }
  }

  #onClick() {
    this._delegate.onCustomerOrderInfoFragmentRequestShowOrder(this,
                                                               this._orderId);
  }

  #showUserInfo(userId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }
};

cart.FOrder = FOrder;
}(window.cart = window.cart || {}));
