import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Cart as CartDataType } from '../../common/datatypes/Cart.js';
import { FProductDelivery } from './FProductDelivery.js';
import { PGoodDelivery } from './PGoodDelivery.js';
import { Cart } from '../../common/dba/Cart.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type Render from '../../lib/ui/renders/Render.js';

interface GoodDeliveryDelegate {
  onGoodDeliveryFragmentRequestAddToCart(f: FGoodDelivery): void;
}

export class FGoodDelivery extends FProductDelivery {
  protected _fBtnAdd: Button;
  protected _delegate!: GoodDeliveryDelegate;

  constructor() {
    super();
    this._fBtnAdd = new Button();
    this._fBtnAdd.setName("Add to cart");
    this._fBtnAdd.setDelegate(this);
    this.setChild("add", this._fBtnAdd);
  }

  onSimpleButtonClicked(_fBtn: Button): void {
    this._delegate.onGoodDeliveryFragmentRequestAddToCart(this);
  }

  _renderOnRender(render: Render): void {
    let panel = this.#createPanel();
    render.wrapPanel(panel);

    let p = panel.getAddBtnPanel();
    this._fBtnAdd.attachRender(p);
    this._fBtnAdd.render();

    p = panel.getProductCountPanel();
    this.#renderCountInCart(p);
  }

  #createPanel(): Panel {
    let p: Panel;
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

  #renderCountInCart(panel: Panel): void {
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

  #countItemInCart(cartId: string, productId: string): number {
    let c = Cart.getCart(cartId);
    return c ? Cart.countProduct(productId) : 0;
  }
}
