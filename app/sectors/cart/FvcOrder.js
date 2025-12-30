import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcOrder extends FScrollViewContent {
  constructor() {
    super();
    this._fOrder = new cart.FOrder();
    this._fOrder.setLayoutType(FOrder.T_LAYOUT.FULL);
    this.setChild("order", this._fOrder);
  }

  setOrderId(id) { this._fOrder.setOrderId(id); }

  _renderContentOnRender(render) {
    this._fOrder.attachRender(render);
    this._fOrder.render();
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.FvcOrder = FvcOrder;
}
