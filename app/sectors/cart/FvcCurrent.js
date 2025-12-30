
const _CFT_CART_CONTENT = {
  EMPTY : `<div class="info-message">Cart is empty.</div>`,
};
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FCart } from './FCart.js';

export class FvcCurrent extends FScrollViewContent {
  constructor() {
    super();
    this._fPayables = new FSimpleFragmentList();
    this.setChild("payables", this._fPayables);

    this._fReserved = new FCart();
    this._fReserved.setName("Saved for later");
    this._fReserved.setCartId(dat.Cart.T_ID.RESERVE);
    this._fReserved.setLayoutType(cart.FCart.T_LAYOUT.RESERVE);
    this._fReserved.setEnableCartTransfer(true);
    this._fReserved.setDataSource(this);
    this._fReserved.setDelegate(this);
    this.setChild("reserved", this._fReserved);
  }

  getUrlParamString() {
    return ui.C.URL_PARAM.ADDON + "=" + C.URL_PARAM_ADDON_VALUE.CART;
  }

  getCartForCartFragment(fCart, cartId) { return dba.Cart.getCart(cartId); }

  onCartFragmentRequestShowView(fCart, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }
  onCartFragmentRequestChangeItemQuantity(fCart, cartId, itemId, dQty) {
    dba.Cart.asyncChangeItemQuantity(itemId, dQty);
  }
  onCartFragmentRequestRemoveItem(fCart, cartId, itemId) {
    dba.Cart.asyncRemoveItem(cartId, itemId);
  }
  onCartFragmentRequestCheckout(fCart, cartId, currencyId) {
    let c = dba.Cart.getCart(cartId);
    let items = c ? c.getItems() : [];
    let ids = items.filter(i => i.getPreferredCurrencyId() == currencyId)
                  .map(i => i.getId());
    this.#asyncRequestOrderPreview(currencyId, ids);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.DRAFT_ORDERS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.PanelWrapper();
    p.pushPanel(pp);

    this._fPayables.clear();
    let ids = this.#getPayableCurrencyIds();
    if (ids.length) {
      for (let id of ids) {
        let f = new cart.FCart();
        f.setLayoutType(cart.FCart.T_LAYOUT.ACTIVE);
        f.setCartId(dat.Cart.T_ID.ACTIVE);
        f.setCurrencyId(id);
        f.setEnableCartTransfer(true);
        f.setDataSource(this);
        f.setDelegate(this);
        this._fPayables.append(f);
      }
      this._fPayables.attachRender(pp);
      this._fPayables.render();
    } else {
      pp.replaceContent(_CFT_CART_CONTENT.EMPTY);
    }

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this._fReserved.attachRender(pp);
    this._fReserved.render();
  }

  #getPayableCurrencyIds() {
    let c = dba.Cart.getCart(dat.Cart.T_ID.ACTIVE);
    return c ? c.getAllCurrencyIds() : [];
  }

  #asyncRequestOrderPreview(currencyId, itemIds) {
    let fd = new FormData();
    fd.append('currency_id', currencyId);
    for (let id of itemIds) {
      fd.append('item_ids', id);
    }
    let url = "/api/cart/guest_order_preview";
    if (dba.Account.isAuthenticated()) {
      url = "/api/cart/order_preview";
    }
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onOrderPreviewRRR(d));
  }

  #onOrderPreviewRRR(data) {
    this.#goCheckout(new dat.PreviewOrder(data.order));
  }

  #goCheckout(order) {
    if (dba.Account.isAuthenticated()) {
      let v = new ui.View();
      let f = new cart.FvcCheckout();
      f.setOrder(order);
      v.setContentFragment(f);
      this._owner.onFragmentRequestShowView(this, v, "Checkout");
    } else {
      let gw = new auth.Gateway();
      let v = gw.createLoginView();
      this._owner.onFragmentRequestShowView(this, v, "Login");
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.FvcCurrent = FvcCurrent;
}
