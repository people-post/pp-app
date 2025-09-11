(function(shop) {
class FGoodDelivery extends shop.FProductDelivery {
  constructor() {
    super();
    this._fBtnAdd = new ui.Button();
    this._fBtnAdd.setName("Add to cart");
    this._fBtnAdd.setDelegate(this);
    this.setChild("add", this._fBtnAdd);
  }

  onSimpleButtonClicked(fBtn) {
    this._delegate.onGoodDeliveryFragmentRequestAddToCart(this);
  }

  _renderOnRender(render) {
    let panel = this.#createPanel();
    render.wrapPanel(panel);

    let p = panel.getAddBtnPanel();
    this._fBtnAdd.attachRender(p);
    this._fBtnAdd.render();

    p = panel.getProductCountPanel();
    this.#renderCountInCart(p);
  }

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.COMPACT:
      p = new shop.PGoodDelivery(); // TODO: Make new panel
      break;
    default:
      p = new shop.PGoodDelivery();
      break;
    }
    return p;
  }

  #renderCountInCart(panel) {
    let product = this._getProduct();
    let s = "";
    let count = 0;
    if (product) {
      count = this.#countItemInCart(dat.Cart.T_ID.ACTIVE, product.getId());
    }
    if (count) {
      s = count.toString() + " in cart";
    }
    panel.replaceContent(s);
  }

  #countItemInCart(cartId, productId) {
    let c = dba.Cart.getCart(cartId);
    return c ? dba.Cart.countProduct(productId) : 0;
  }
};

shop.FGoodDelivery = FGoodDelivery;
}(window.shop = window.shop || {}));
