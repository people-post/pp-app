import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { PreviewOrder } from '../../common/datatypes/PreviewOrder.js';
import { FChooseCheckoutItem } from './FChooseCheckoutItem.js';
import { FCart } from '../../sectors/cart/FCart.js';
import { FvcCheckout } from '../../sectors/cart/FvcCheckout.js';
import { Shop } from '../../common/dba/Shop.js';
import { Counter } from '../../common/dba/Counter.js';
import { Api } from '../../common/plt/Api.js';
import { Cart as CartDataType } from '../../common/datatypes/Cart.js';

export class FvcPreCheckout extends FScrollViewContent {
  // Serves as checkout register
  private _fChoose: FChooseCheckoutItem;
  private _fCart: FCart;
  private _cart: CartDataType | null = null;

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

  setCart(cart: CartDataType): void { this._cart = cart; }

  getCartForCartFragment(_fCart: FCart, _cartId: string): CartDataType | null { return this._cart; }

  onCartFragmentRequestShowView(_fCart: FCart, view: View, title: string): void {
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, view, title);
  }
  onCartFragmentRequestChangeItemQuantity(fCart: FCart, _cartId: string, itemId: string, dQty: number): void {
    if (this._cart) {
      this._cart.changeQuantity(itemId, dQty);
      fCart.render();
    }
  }
  onCartFragmentRequestRemoveItem(fCart: FCart, _cartId: string, itemId: string): void {
    if (this._cart) {
      this._cart.remove(itemId);
      fCart.render();
    }
  }
  onCartFragmentRequestCheckout(_fCart: FCart, _cartId: string, currencyId: string): void {
    if (this._cart) {
      this.#asyncRequestOrderPreview(this._cart, currencyId);
    }
  }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
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

  #asyncRequestOrderPreview(cart: CartDataType, currencyId: string): void {
    let fd = new FormData();
    fd.append('currency_id', currencyId);
    for (let item of cart.getItems()) {
      fd.append('items', JSON.stringify(item.toJsonDict()));
    }
    let url = "/api/shop/charge_preview";
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onOrderPreviewRRR(d));
  }

  #onOrderPreviewRRR(data: { order: unknown }): void {
    this.#goCheckout(new PreviewOrder(data.order));
  }

  #goCheckout(order: PreviewOrder): void {
    let v = new View();
    let f = new FvcCheckout();
    f.setOrder(order);
    f.setNeedsShipping(false);
    // Note: Only available in Counter session
    f.setRegisterId(Counter.getRegisterId());
    v.setContentFragment(f);
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, v, "Checkout");
  }
}

export default FvcPreCheckout;
