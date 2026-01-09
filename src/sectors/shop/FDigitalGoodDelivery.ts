import { FGoodDelivery } from './FGoodDelivery.js';
import type Render from '../../lib/ui/renders/Render.js';

const _CFT_PRODUCT_DELIVERY_CHOICE = {
  ADD_TO_CART: "Add to cart",
} as const;

export class FDigitalGoodDelivery extends FGoodDelivery {
  _renderOnRender(render: Render): void {
    let s = _CFT_PRODUCT_DELIVERY_CHOICE.ADD_TO_CART;
    render.replaceContent(s);
  }
}
