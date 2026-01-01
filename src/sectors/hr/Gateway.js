import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { Tag } from '../../common/datatypes/Tag.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { FvcCareerList as BlogFvcCareerList } from '../blog/FvcCareerList.js';
import { FvcCareerList as WorkshopFvcCareerList } from '../workshop/FvcCareerList.js';
import { FvcCareerList as ShopFvcCareerList } from '../shop/FvcCareerList.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { Shop } from '../../common/dba/Shop.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment() {
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
