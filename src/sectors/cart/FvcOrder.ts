import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FOrder } from './FOrder.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcOrder extends FScrollViewContent {
  protected _fOrder: FOrder;

  constructor() {
    super();
    this._fOrder = new FOrder();
    this._fOrder.setLayoutType(FOrder.T_LAYOUT.FULL);
    this.setChild("order", this._fOrder);
  }

  setOrderId(id: string | null): void { this._fOrder.setOrderId(id); }

  _renderContentOnRender(render: Render): void {
    this._fOrder.attachRender(render);
    this._fOrder.render();
  }
}
