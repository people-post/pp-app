import { View } from '../../lib/ui/controllers/views/View.js';
import { Cart as CartDataType } from '../datatypes/Cart.js';

type PreCheckoutViewFactory = (cart: CartDataType) => View;

let gPreCheckoutViewFactory: PreCheckoutViewFactory | null = null;

export class PreCheckoutFacade {
  static registerPreCheckoutViewFactory(factory: PreCheckoutViewFactory): void {
    gPreCheckoutViewFactory = factory;
  }

  static createPreCheckoutView(cart: CartDataType): View | null {
    if (!gPreCheckoutViewFactory) {
      return null;
    }
    return gPreCheckoutViewFactory(cart);
  }
}

export default PreCheckoutFacade;
