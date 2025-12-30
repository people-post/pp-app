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

export class FvcCheckoutSuccess extends FScrollViewContent {
  constructor() {
    super();
    this._orderId = null;
  }

  setOrderId(id) { this._orderId = id; }

  action(type, ...args) {
    switch (type) {
    case cart.CF_CHECKOUT_SUCCESS.CONTINUE:
      this._owner.onViewRequestPop(this);
      break;
    case cart.CF_CHECKOUT_SUCCESS.SHOW_ORDER:
      this.#onShowOrder();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let s = _CFT_CHECKOUT_SUCCESS.MAIN;
    s = s.replace("__REF_ID__", Utilities.orderIdToReferenceId(this._orderId));
    render.replaceContent(s);
  }

  #onShowOrder() {
    let v = new ui.View();
    let f = new cart.FvcOrder();
    f.setOrderId(this._orderId);
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v, "Order");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.CF_CHECKOUT_SUCCESS = CF_CHECKOUT_SUCCESS;
}