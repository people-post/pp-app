import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { Tag } from '../../common/datatypes/Tag.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment() {
    let f = new FViewContentMux();

    let ff = new blog.FvcCareerList();
    f.addTab(
        {name : R.t("Blog"), value : Tag.T_ID.BLOG, icon : C.ICON.BLOG},
        ff);

    if (dba.Workshop.isOpen()) {
      ff = new wksp.FvcCareerList();
      f.addTab(
          {name : R.t("Workshop"), value : "WORKSHOP", icon : C.ICON.WORKSHOP},
          ff);
    }

    if (dba.Shop.isOpen()) {
      ff = new shop.FvcCareerList();
      f.addTab({name : R.t("Shop"), value : "SHOP", icon : C.ICON.SHOP}, ff);
    }

    f.switchTo(Tag.T_ID.BLOG);
    return f;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hr = window.hr || {};
  window.hr.Gateway = Gateway;
}
