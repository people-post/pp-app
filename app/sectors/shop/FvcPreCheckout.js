
export class FvcPreCheckout extends ui.FScrollViewContent {
  // Serves as checkout register
  constructor() {
    super();
    this._fChoose = new shop.FChooseCheckoutItem();
    this.setChild("choose", this._fChoose);

    this._fCart = new cart.FCart();
    this._fCart.setLayoutType(cart.FCart.T_LAYOUT.ACTIVE);
    this._fCart.setDataSource(this);
    this._fCart.setDelegate(this);
    this.setChild("cart", this._fCart);

    this._cart = null;
  }

  setCart(cart) { this._cart = cart; }

  getCartForCartFragment(fCart, cartId) { return this._cart; }

  onCartFragmentRequestShowView(fCart, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }
  onCartFragmentRequestChangeItemQuantity(fCart, cartId, itemId, dQty) {
    this._cart.changeQuantity(itemId, dQty);
    fCart.render();
  }
  onCartFragmentRequestRemoveItem(fCart, cartId, itemId) {
    this._cart.remove(itemId);
    fCart.render();
  }
  onCartFragmentRequestCheckout(fCart, cartId, currencyId) {
    this.#asyncRequestOrderPreview(this._cart, currencyId);
  }

  _renderContentOnRender(render) {
    let pMain = new ui.ListPanel();
    render.wrapPanel(pMain);
    let p = new ui.PanelWrapper();
    pMain.pushPanel(p);
    this._fChoose.attachRender(p);
    this._fChoose.render();
    pMain.pushSpace(1);

    p = new ui.PanelWrapper();
    pMain.pushPanel(p);

    // Hack
    let cId = dba.Shop.getCurrencyIds()[0];
    this._fCart.setCurrencyId(cId);

    this._fCart.attachRender(p);
    this._fCart.render();
  }

  #asyncRequestOrderPreview(cart, currencyId) {
    let fd = new FormData();
    fd.append('currency_id', currencyId);
    for (let item of cart.getItems()) {
      fd.append('items', JSON.stringify(item.toJsonDict()));
    }
    let url = "/api/shop/charge_preview";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onOrderPreviewRRR(d));
  }

  #onOrderPreviewRRR(data) {
    this.#goCheckout(new dat.PreviewOrder(data.order));
  }

  #goCheckout(order) {
    let v = new ui.View();
    let f = new cart.FvcCheckout();
    f.setOrder(order);
    f.setNeedsShipping(false);
    // Note: Only available in Counter session
    f.setRegisterId(dba.Counter.getRegisterId());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Checkout");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcPreCheckout = FvcPreCheckout;
}
