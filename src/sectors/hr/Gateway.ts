import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import type { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { Tag } from '../../common/datatypes/Tag.js';
import { SectorGateway, PageConfig } from '../../common/plt/SectorGateway.js';
import { FvcCareerList as BlogFvcCareerList } from '../blog/FvcCareerList.js';
import { FvcCareerList as WorkshopFvcCareerList } from '../workshop/FvcCareerList.js';
import { FvcCareerList as ShopFvcCareerList } from '../shop/FvcCareerList.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { Shop } from '../../common/dba/Shop.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class Gateway implements SectorGateway {
  isLoginRequired(): boolean { return false; }
  isPageNavItem(_pageId: string): boolean { return false; }
  shouldEnableSessionAction(_pageId: string): boolean { return true; }
  getIcon(): string | null { return null; }
  getDefaultPageId(): string | null { return null; }
  getBannerFragment(): Fragment | null { return null; }
  getPageConfigs(): PageConfig[] { return []; }
  getNPageNotifications(_pageId: string): number { return 0; }
  createPageEntryViews(_pageId: string): View[] { return []; }
  createPageOptionalViews(_pageId: string): View[] { return []; }
  createMainViewContentFragment(): FViewContentBase {
    let f = new FViewContentMux();

    let ff = new BlogFvcCareerList();
    f.addTab(
        {name : R.t("Blog"), value : Tag.T_ID.BLOG, icon : ICON.BLOG},
        ff);

    if (Workshop.isOpen()) {
      ff = new WorkshopFvcCareerList();
      f.addTab(
          {name : R.t("Workshop"), value : "WORKSHOP", icon : ICON.WORKSHOP},
          ff);
    }

    if (Shop.isOpen()) {
      ff = new ShopFvcCareerList();
      f.addTab({name : R.t("Shop"), value : "SHOP", icon : ICON.SHOP}, ff);
    }

    f.switchTo(Tag.T_ID.BLOG);
    return f;
  }
};
