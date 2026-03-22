import { View } from '../../lib/ui/controllers/views/View.js';
import { QuoteTargetFacade } from '../../common/shop/QuoteTargetFacade.js';
import { FProjectInfo } from '../../sectors/workshop/FProjectInfo.js';
import { FProduct } from '../../sectors/shop/FProduct.js';
import { FvcProject } from '../../sectors/workshop/FvcProject.js';
import { FvcProduct } from '../../sectors/shop/FvcProduct.js';

export function registerQuoteTargetFactories(): void {
  QuoteTargetFacade.registerProjectInfoFactory(() => new FProjectInfo());
  QuoteTargetFacade.registerProductInfoFactory(() => new FProduct());
  QuoteTargetFacade.registerProjectViewFactory((projectId: string) => {
    let v = new View();
    let f = new FvcProject();
    f.setProjectId(projectId);
    v.setContentFragment(f);
    return v;
  });
  QuoteTargetFacade.registerProductViewFactory((productId: string) => {
    let v = new View();
    let f = new FvcProduct();
    f.setProductId(productId);
    v.setContentFragment(f);
    return v;
  });
}
