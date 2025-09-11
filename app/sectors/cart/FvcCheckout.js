(function(cart) {
class FvcCheckout extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fShipping = new gui.AddressEditor();
    this.setChild("shipping", this._fShipping);

    this._fOrder = new cart.FPreviewOrder();
    this._fOrder.setDataSource(this);
    this.setChild("order", this._fOrder);

    this._fPayment = new pay.FPayment();
    this._fPayment.setDataSource(this);
    this._fPayment.setDelegate(this);
    this.setChild("payment", this._fPayment);

    this._order = null;
    this._isShippingNeeded = true;
  }

  setNeedsShipping(b) { this._isShippingNeeded = b; }
  setOrder(order) { this._order = order; }
  setRegisterId(id) { this._fPayment.setRegisterId(id); }

  getOrderForPreviewOrderFragment(fPreviewOrder) { return this._order; }
  getOrderForCartPaymentFragment(fCartPayment) { return this._order; }

  onPaymentSuccessInCartPaymentFragment(fCartPayment, orderId) {
    let v = new ui.View();
    let f = new cart.FvcCheckoutSuccess();
    f.setOrderId(orderId);
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v, "Payment success");
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let pp = new ui.SectionPanel("Order review");
    p.pushPanel(pp);
    this._fOrder.attachRender(pp.getContentPanel());
    this._fOrder.render();

    if (this._isShippingNeeded) {
      pp = new ui.SectionPanel("Shipping Address");
      p.pushPanel(pp);
      this._fShipping.attachRender(pp.getContentPanel());
      this._fShipping.render();
    }

    pp = new ui.SectionPanel("Payment");
    p.pushPanel(pp);
    this._fPayment.attachRender(pp.getContentPanel());
    this._fPayment.render();

    p.pushSpace(2);
  }
};

cart.FvcCheckout = FvcCheckout;
}(window.cart = window.cart || {}));
