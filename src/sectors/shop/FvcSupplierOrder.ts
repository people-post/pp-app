import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSupplierOrder } from './FSupplierOrder.js';

export class FvcSupplierOrder extends FScrollViewContent {
  #fOrder: FSupplierOrder;
  
  constructor() {
    super();
    this.#fOrder = new FSupplierOrder();
    this.#fOrder.setLayoutType(FSupplierOrder.T_LAYOUT.FULL);
    this.setChild("order", this.#fOrder);
  }

  setOrderId(id: string): void { this.#fOrder.setOrderId(id); }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this.#fOrder.attachRender(render);
    this.#fOrder.render();
  }
}

export default FvcSupplierOrder;
