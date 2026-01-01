
const _CFT_CART_CONTENT = {
  EMPTY : `<div class="info-message">Cart is empty.</div>`,
};
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FCart } from './FCart.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Cart } from '../../common/dba/Cart.js';
import { Account } from '../../common/dba/Account.js';
import { Cart as CartDataType } from '../../common/datatypes/Cart.js';
import { PreviewOrder } from '../../common/datatypes/PreviewOrder.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Api } from '../../common/plt/Api.js';
import { URL_PARAM, URL_PARAM_ADDON_VALUE } from '../../common/constants/Constants.js';
import { FvcCheckout } from './FvcCheckout.js';
import { Gateway as AuthGateway } from '../auth/Gateway.js';

export class FvcCurrent extends FScrollViewContent {
  constructor() {
    super();
    this._fPayables = new FSimpleFragmentList();
    this.setChild("payables", this._fPayables);

    this._fReserved = new FCart();
    this._fReserved.setName("Saved for later");
    this._fReserved.setCartId(CartDataType.T_ID.RESERVE);
    this._fReserved.setLayoutType(FCart.T_LAYOUT.RESERVE);
    this._fReserved.setEnableCartTransfer(true);
    this._fReserved.setDataSource(this);
    this._fReserved.setDelegate(this);
    this.setChild("reserved", this._fReserved);
  }

  getUrlParamString() {
    return URL_PARAM.ADDON + "=" + URL_PARAM_ADDON_VALUE.CART;
  }

  getCartForCartFragment(fCart, cartId) { return Cart.getCart(cartId); }

  onCartFragmentRequestShowView(fCart, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }
  onCartFragmentRequestChangeItemQuantity(fCart, cartId, itemId, dQty) {
    Cart.asyncChangeItemQuantity(itemId, dQty);
  }
  onCartFragmentRequestRemoveItem(fCart, cartId, itemId) {
    Cart.asyncRemoveItem(cartId, itemId);
  }
  onCartFragmentRequestCheckout(fCart, cartId, currencyId) {
    let c = Cart.getCart(cartId);
    let items = c ? c.getItems() : [];
    let ids = items.filter(i => i.getPreferredCurrencyId() == currencyId)
                  .map(i => i.getId());
    this.#asyncRequestOrderPreview(currencyId, ids);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.DRAFT_ORDERS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new PanelWrapper();
    p.pushPanel(pp);

    this._fPayables.clear();
    let ids = this.#getPayableCurrencyIds();
    if (ids.length) {
      for (let id of ids) {
        let f = new FCart();
        f.setLayoutType(FCart.T_LAYOUT.ACTIVE);
        f.setCartId(CartDataType.T_ID.ACTIVE);
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

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fReserved.attachRender(pp);
    this._fReserved.render();
  }

  #getPayableCurrencyIds() {
    let c = Cart.getCart(CartDataType.T_ID.ACTIVE);
    return c ? c.getAllCurrencyIds() : [];
  }

  #asyncRequestOrderPreview(currencyId, itemIds) {
    let fd = new FormData();
    fd.append('currency_id', currencyId);
    for (let id of itemIds) {
      fd.append('item_ids', id);
    }
    let url = "/api/cart/guest_order_preview";
    if (Account.isAuthenticated()) {
      url = "/api/cart/order_preview";
    }
    Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onOrderPreviewRRR(d));
  }

  #onOrderPreviewRRR(data) {
    this.#goCheckout(new PreviewOrder(data.order));
  }

  #goCheckout(order) {
    if (Account.isAuthenticated()) {
      let v = new View();
      let f = new FvcCheckout();
      f.setOrder(order);
      v.setContentFragment(f);
      this._owner.onFragmentRequestShowView(this, v, "Checkout");
    } else {
      let gw = new AuthGateway();
      let v = gw.createLoginView();
      this._owner.onFragmentRequestShowView(this, v, "Login");
    }
  }
};
