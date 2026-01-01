import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { PreviewOrder } from '../../common/datatypes/PreviewOrder.js';
import { api } from '../../common/plt/Api.js';
import { FChooseCheckoutItem } from './FChooseCheckoutItem.js';
import { FCart } from '../../sectors/cart/FCart.js';
import { FvcCheckout } from '../../sectors/cart/FvcCheckout.js';
import { Shop } from '../../common/dba/Shop.js';
import { Counter } from '../../common/dba/Counter.js';

export class FvcPreCheckout extends FScrollViewContent {
  // Serves as checkout register
  constructor() {
    super();
    this._fChoose = new FChooseCheckoutItem();
    this.setChild("choose", this._fChoose);

    this._fCart = new FCart();
    this._fCart.setLayoutType(FCart.T_LAYOUT.ACTIVE);
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
    let pMain = new ListPanel();
    render.wrapPanel(pMain);
    let p = new PanelWrapper();
    pMain.pushPanel(p);
    this._fChoose.attachRender(p);
    this._fChoose.render();
    pMain.pushSpace(1);

    p = new PanelWrapper();
    pMain.pushPanel(p);

    // Hack
    let cId = Shop.getCurrencyIds()[0];
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
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onOrderPreviewRRR(d));
  }

  #onOrderPreviewRRR(data) {
    this.#goCheckout(new PreviewOrder(data.order));
  }

  #goCheckout(order) {
    let v = new View();
    let f = new FvcCheckout();
    f.setOrder(order);
    f.setNeedsShipping(false);
    // Note: Only available in Counter session
    f.setRegisterId(Counter.getRegisterId());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Checkout");
  }
};
