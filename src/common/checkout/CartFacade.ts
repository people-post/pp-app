import { View } from '../../lib/ui/controllers/views/View.js';

type CartViewFactory = () => View;

let gCartViewFactory: CartViewFactory | null = null;

export class CartFacade {
  static registerCartViewFactory(factory: CartViewFactory): void {
    gCartViewFactory = factory;
  }

  static createCartView(): View | null {
    if (!gCartViewFactory) {
      return null;
    }
    return gCartViewFactory();
  }
}

export default CartFacade;
