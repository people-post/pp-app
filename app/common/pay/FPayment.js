(function(pay) {
const _CFT_PAYMENT = {
  TITLE : `<div class="payment-choice-title">__TEXT__</div>`,
}

class FPayment extends ui.Fragment {
  constructor() {
    super();
    this._fAsset = new gui.FoldableItemFragment();
    this._fAsset.setHeaderFragment(this.#createTitleFragment("Pay by balance"));
    this._fAsset.setDelegate(this);
    this.setChild("asset", this._fAsset);

    this._fSquare = new gui.FoldableItemFragment();
    this._fSquare.setHeaderFragment(this.#createTitleFragment("Pay by card"));
    let f = new pay.FSquareOnline();
    f.setDelegate(this);
    this._fSquare.setContentFragment(f);
    this._fSquare.setDelegate(this);
    this.setChild("square", this._fSquare);

    // For offline checkout
    this._fTerminals = new pay.FPaymentTerminalList();
    this._fTerminals.setDelegate(this);
    this.setChild("terminals", this._fTerminals);

    this._fSelected = null;
  }

  setRegisterId(id) { this._fTerminals.setRegisterId(id); }

  onFoldableItemOpen(fItem, itemId) {
    if (this._fSelected) {
      this._fSelected.close();
    }
    this._fSelected = fItem;
  }
  onFoldableItemClose(fItem, itemId) { this._fSelected = null; }

  onSquareOnlinePayFragmentRequestPay(fSquare, locationId, sourceId) {
    let order = this._dataSource.getOrderForCartPaymentFragment(this);
    this.#asyncSubmitSquareOnlinePay(locationId, sourceId, order.getId());
  }
  onPaymentTerminalSelectedInPaymentTerminalListFragment(fTerminalList,
                                                         terminalId) {
    this.#asyncSubmitTerminalPay(terminalId);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.ASSET:
      this.render();
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let order = this._dataSource.getOrderForCartPaymentFragment(this);
    let nAsset = dba.Exchange.getAsset(order.getCurrencyId());
    if (nAsset && nAsset >= order.getTotal()) {
      let pp = new ui.PanelWrapper();
      p.pushPanel(pp);

      this._fAsset.setIsOpen(this._fSelected == this._fAsset);
      this._fAsset.attachRender(pp);
      this._fAsset.render();
    }

    let pp = new ui.PanelWrapper();
    p.pushPanel(pp);

    this._fSquare.setIsOpen(this._fSelected == this._fSquare);
    this._fSquare.attachRender(pp);
    this._fSquare.render();

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    if (this._fTerminals.getRegisterId()) {
      this._fTerminals.attachRender(pp);
      this._fTerminals.render();
    }
  }

  #createTitleFragment(text) {
    let s = _CFT_PAYMENT.TITLE;
    s = s.replace("__TEXT__", text);
    return new ui.SimpleText(s);
  };

  #asyncSubmitSquareOnlinePay(locationId, sourceId, orderId) {
    let url = "/api/cart/guest_square_pay";
    if (dba.Account.isAuthenticated()) {
      url = "/api/cart/square_pay";
    }
    let fd = new FormData();
    fd.append("location_id", locationId);
    fd.append("source_id", sourceId);
    fd.append("order_id", orderId);

    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onOnlinePayRRR(d));
  }

  #onOnlinePayRRR(data) {
    dba.Cart.clear();
    this._delegate.onPaymentSuccessInCartPaymentFragment(this, data.order_id);
  }

  #asyncSubmitTerminalPay(terminalId) {
    let url = "/api/shop/charge_by_terminal";
    let fd = new FormData();
    fd.append("terminal_id", terminalId);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onTerminalPayRRR(d));
  }

  #onTerminalPayRRR(data) {
    // Payment awaiting on terminal
    // TODO: Invoke waiting view
  }
};

pay.FPayment = FPayment;
}(window.pay = window.pay || {}));
