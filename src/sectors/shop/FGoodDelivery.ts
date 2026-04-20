import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Cart as CartDataType } from '../../common/datatypes/Cart.js';
import { FProductDelivery } from './FProductDelivery.js';
import { PGoodDelivery } from './PGoodDelivery.js';
import { Cart } from '../../common/dba/Cart.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PGoodDeliveryBase } from './PGoodDeliveryBase.js';

export interface FGoodDeliveryDelegate {
  onGoodDeliveryFragmentRequestAddToCart(f: FGoodDelivery): void;
}

export class FGoodDelivery extends FProductDelivery {
  protected _fBtnAdd: Button;

  constructor() {
    super();
    this._fBtnAdd = new Button();
    this._fBtnAdd.setName("Add to cart");
    this._fBtnAdd.setDelegate(this);
    this.setChild("add", this._fBtnAdd);
  }

  onSimpleButtonClicked(_fBtn: Button): void {
    this.getDelegate<FGoodDeliveryDelegate>()?.onGoodDeliveryFragmentRequestAddToCart(this);
  }

  _renderOnRender(render: PanelWrapper): void {
    let panel = this.#createPanel();
    render.wrapPanel(panel);

    let pAddBtn = panel.getAddBtnPanel();
    this._fBtnAdd.attachRender(pAddBtn);
    this._fBtnAdd.render();

    let pProductCount = panel.getProductCountPanel();
    this.#renderCountInCart(pProductCount);
  }

  #createPanel(): PGoodDeliveryBase {
    let p: PGoodDeliveryBase;
    switch (this._tLayout) {
    case FGoodDelivery.T_LAYOUT.COMPACT:
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
    return c ? c.countProduct(productId) : 0;
  }
}
