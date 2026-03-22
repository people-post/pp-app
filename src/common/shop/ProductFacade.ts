import { View } from '../../lib/ui/controllers/views/View.js';

type ProductViewFactory = (productId: string) => View;

let gProductViewFactory: ProductViewFactory | null = null;

export class ProductFacade {
  static registerProductViewFactory(factory: ProductViewFactory): void {
    gProductViewFactory = factory;
  }

  static createProductView(productId: string): View | null {
    if (!gProductViewFactory) {
      return null;
    }
    return gProductViewFactory(productId);
  }
}

export default ProductFacade;
