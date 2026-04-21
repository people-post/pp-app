import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { Tag } from '../../common/datatypes/Tag.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { Shop } from '../../common/dba/Shop.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';
import { FvcCareerList as BlogFvcCareerList } from '../../sectors/blog/FvcCareerList.js';
import { FvcCareerList as WorkshopFvcCareerList } from '../../sectors/workshop/FvcCareerList.js';
import { FvcCareerList as ShopFvcCareerList } from '../../sectors/shop/FvcCareerList.js';

export function createCareersViewContentMux(): FViewContentMux {
  let mux = new FViewContentMux();

  let fBlog = new BlogFvcCareerList();
  mux.addTab({name : R.t("Blog"), value : Tag.T_ID.BLOG, icon : ICON.BLOG}, fBlog);

  if (Workshop.isOpen()) {
    let fWorkshop = new WorkshopFvcCareerList();
    mux.addTab(
        {name : R.t("Workshop"), value : "WORKSHOP", icon : ICON.WORKSHOP},
        fWorkshop);
  }

  if (Shop.isOpen()) {
    let fShop = new ShopFvcCareerList();
    mux.addTab({name : R.t("Shop"), value : "SHOP", icon : ICON.SHOP}, fShop);
  }

  mux.switchTo(Tag.T_ID.BLOG);
  return mux;
}
