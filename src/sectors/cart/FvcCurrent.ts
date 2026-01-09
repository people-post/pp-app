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
import { Cart as CartDataType } from '../../common/datatypes/Cart.js';
import { PreviewOrder } from '../../common/datatypes/PreviewOrder.js';
import { T_DATA } from '../../common/plt/Events.js';
import { URL_PARAM, URL_PARAM_ADDON_VALUE } from '../../common/constants/Constants.js';
import { FvcCheckout } from './FvcCheckout.js';
import { Gateway as AuthGateway } from '../auth/Gateway.js';
import { Api } from '../../common/plt/Api.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcCurrent extends FScrollViewContent {
  protected _fPayables: FSimpleFragmentList;
  protected _fReserved: FCart;

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

  getUrlParamString(): string {
    return URL_PARAM.ADDON + "=" + URL_PARAM_ADDON_VALUE.CART;
  }

  getCartForCartFragment(fCart: FCart, cartId: string | null): CartDataType | null { return Cart.getCart(cartId); }

  onCartFragmentRequestShowView(fCart: FCart, view: View, title: string): void {
    this._owner.onFragmentRequestShowView(this, view, title);
  }
  onCartFragmentRequestChangeItemQuantity(fCart: FCart, cartId: string | null, itemId: string, dQty: number): void {
    Cart.asyncChangeItemQuantity(itemId, dQty);
  }
  onCartFragmentRequestRemoveItem(fCart: FCart, cartId: string | null, itemId: string): void {
    Cart.asyncRemoveItem(cartId, itemId);
  }
  onCartFragmentRequestCheckout(fCart: FCart, cartId: string | null, currencyId: string | null): void {
    let c = Cart.getCart(cartId);
    let items = c ? c.getItems() : [];
    let ids = items.filter(i => i.getPreferredCurrencyId() == currencyId)
                  .map(i => i.getId());
    if (currencyId) {
      this.#asyncRequestOrderPreview(currencyId, ids);
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.DRAFT_ORDERS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: Render): void {
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

  #getPayableCurrencyIds(): string[] {
    let c = Cart.getCart(CartDataType.T_ID.ACTIVE);
    return c ? c.getAllCurrencyIds() : [];
  }

  #asyncRequestOrderPreview(currencyId: string, itemIds: string[]): void {
    let fd = new FormData();
    fd.append('currency_id', currencyId);
    for (let id of itemIds) {
      fd.append('item_ids', id);
    }
    let url = "/api/cart/guest_order_preview";
    if (window.dba.Account.isAuthenticated()) {
      url = "/api/cart/order_preview";
    }
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onOrderPreviewRRR(d));
  }

  #onOrderPreviewRRR(data: unknown): void {
    let orderData = (data as { order?: unknown }).order;
    if (orderData) {
      this.#goCheckout(new PreviewOrder(orderData));
    }
  }

  #goCheckout(order: PreviewOrder): void {
    if (window.dba.Account.isAuthenticated()) {
      let v = new View();
      let f = new FvcCheckout();
      f.setOrder(order as unknown as CustomerOrder);
      v.setContentFragment(f);
      this._owner.onFragmentRequestShowView(this, v, "Checkout");
    } else {
      let gw = new AuthGateway();
      let v = gw.createLoginView();
      this._owner.onFragmentRequestShowView(this, v, "Login");
    }
  }
};
