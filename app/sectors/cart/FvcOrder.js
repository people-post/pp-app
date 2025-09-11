(function(cart) {
class FvcOrder extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fOrder = new cart.FOrder();
    this._fOrder.setLayoutType(cart.FOrder.T_LAYOUT.FULL);
    this.setChild("order", this._fOrder);
  }

  setOrderId(id) { this._fOrder.setOrderId(id); }

  _renderContentOnRender(render) {
    this._fOrder.attachRender(render);
    this._fOrder.render();
  }
};

cart.FvcOrder = FvcOrder;
}(window.cart = window.cart || {}));
