import { FGoodDelivery } from './FGoodDelivery.js';

export class FDigitalGoodDelivery extends FGoodDelivery {
  _renderOnRender(render) {
    let s = _CFT_PRODUCT_DELIVERY_CHOICE.ADD_TO_CART;
    render.replaceContent(s);
  }
};
