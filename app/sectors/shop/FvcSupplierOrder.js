import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcSupplierOrder extends FScrollViewContent {
  #fOrder;
  
  constructor() {
    super();
    this.#fOrder = new shop.FSupplierOrder();
    this.#fOrder.setLayoutType(shop.FSupplierOrder.T_LAYOUT.FULL);
    this.setChild("order", this.#fOrder);
  }

  setOrderId(id) { this.#fOrder.setOrderId(id); }

  _renderContentOnRender(render) {
    this.#fOrder.attachRender(render);
    this.#fOrder.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcSupplierOrder = FvcSupplierOrder;
}
