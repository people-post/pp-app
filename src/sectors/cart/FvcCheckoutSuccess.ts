export const CF_CHECKOUT_SUCCESS = {
  CONTINUE : Symbol(),
  SHOW_ORDER : Symbol(),
};

const _CFT_CHECKOUT_SUCCESS = {
  MAIN :
      `<div class="info-message">Success! Your order id is: <span class="clickable" onclick="javascript:G.action(cart.CF_CHECKOUT_SUCCESS.SHOW_ORDER)">__REF_ID__</a></div>
    <br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(cart.CF_CHECKOUT_SUCCESS.CONTINUE)">Continue shopping</a>
    <br>
    <br>`,
}

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Utilities } from '../../common/Utilities.js';
import { FvcOrder } from './FvcOrder.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcCheckoutSuccess extends FScrollViewContent {
  protected _orderId: string | null;

  constructor() {
    super();
    this._orderId = null;
  }

  setOrderId(id: string | null): void { this._orderId = id; }

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_CHECKOUT_SUCCESS.CONTINUE:
      this._owner.onViewRequestPop(this);
      break;
    case CF_CHECKOUT_SUCCESS.SHOW_ORDER:
      this.#onShowOrder();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    let s = _CFT_CHECKOUT_SUCCESS.MAIN;
    s = s.replace("__REF_ID__", Utilities.orderIdToReferenceId(this._orderId || ""));
    render.replaceContent(s);
  }

  #onShowOrder(): void {
    let v = new View();
    let f = new FvcOrder();
    f.setOrderId(this._orderId);
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v, "Order");
  }
};
