import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Cart as CartDataType } from '../../common/datatypes/Cart.js';
import { FProductDelivery } from './FProductDelivery.js';
import { PGoodDelivery } from './PGoodDelivery.js';

export class FGoodDelivery extends FProductDelivery {
  constructor() {
    super();
    this._fBtnAdd = new Button();
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
      p = new PGoodDelivery(); // TODO: Make new panel
      break;
    default:
      p = new PGoodDelivery();
      break;
    }
    return p;
  }

  #renderCountInCart(panel) {
    let product = this._getProduct();
    let s = "";
    let count = 0;
    if (product) {
      count = this.#countItemInCart(CartDataType.T_ID.ACTIVE, product.getId());
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FGoodDelivery = FGoodDelivery;
}
