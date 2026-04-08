import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FCart } from './FCart.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Cart } from '../../common/dba/Cart.js';
import { Cart as CartDataType } from '../../common/datatypes/Cart.js';
import { T_DATA } from '../../common/plt/Events.js';
import { URL_PARAM } from '../../lib/ui/Constants.js';
import { URL_PARAM_ADDON_VALUE } from '../../common/constants/Constants.js';
import { FvcCheckout } from './FvcCheckout.js';
import { Api } from '../../common/plt/Api.js';
import { Account } from '../../common/dba/Account.js';
import { AuthFacade } from '../../common/auth/AuthFacade.js';
import { ProductFacade } from '../../common/shop/ProductFacade.js';
import { CustomerOrder } from '../../common/datatypes/CustomerOrder.js';
import { CustomerOrderData } from '../../types/backend2.js';

const _CFT_CART_CONTENT = {
  EMPTY : `<div class="info-message">Cart is empty.</div>`,
};

interface ApiOrderPreviewResponse {
  order: CustomerOrderData;
}

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

  getCartForCartFragment(_fCart: FCart, cartId: string | null): CartDataType | null { return Cart.getCart(cartId ?? ''); }

  onCartFragmentRequestShowView(_fCart: FCart, view: View, title: string): void {
    this.onFragmentRequestShowView(this, view, title);
  }
  onCartFragmentRequestChangeItemQuantity(_fCart: FCart, _cartId: string | null, itemId: string, dQty: number): void {
    Cart.asyncChangeItemQuantity(itemId, dQty);
  }
  onCartFragmentRequestRemoveItem(_fCart: FCart, cartId: string | null, itemId: string): void {
    if (!cartId) {
      return;
    }
    Cart.asyncRemoveItem(cartId, itemId);
  }
  onCartFragmentRequestShowProduct(_fCart: FCart, productId: string): void {
    let v = ProductFacade.createProductView(productId);
    if (v) {
      this.onFragmentRequestShowView(this, v, "product");
    }
  }
  onCartFragmentRequestCheckout(_fCart: FCart, cartId: string | null, currencyId: string | null): void {
    let c = cartId ? Cart.getCart(cartId) : null;
    let items = c ? c.getItems() : [];
    let ids = items.filter(i => i.getPreferredCurrencyId() == currencyId)
                  .map(i => i.getId() ?? '')
                  .filter(id => id !== undefined);
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

  _renderContentOnRender(render: PanelWrapper): void {
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
    if (Account.isAuthenticated()) {
      url = "/api/cart/order_preview";
    }
    Api.asFragmentPost<ApiOrderPreviewResponse>(this, url, fd)
        .then(d => this.#onOrderPreviewRRR(d));
  }

  #onOrderPreviewRRR(data: ApiOrderPreviewResponse): void {
    if (data.order) {
      this.#goCheckout(new CustomerOrder(data.order));
    }
  }

  #goCheckout(order: CustomerOrder): void {
    if (Account.isAuthenticated()) {
      let v = new View();
      let f = new FvcCheckout();
      f.setOrder(order);
      v.setContentFragment(f);
      this.onFragmentRequestShowView(this, v, "Checkout");
    } else {
      let v = AuthFacade.createLoginView();
      if (v) {
        this.onFragmentRequestShowView(this, v, "Login");
      }
    }
  }
};
