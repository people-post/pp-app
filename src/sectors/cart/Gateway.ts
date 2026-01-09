import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { FvcCurrent } from './FvcCurrent.js';
import { FvcHistory } from './FvcHistory.js';
import { SectorGateway, PageConfig } from '../../common/plt/SectorGateway.js';
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
  createMainViewContentFragment(): Fragment {
    let f = new FViewContentMux();

    let ff1 = new FvcCurrent();
    f.addTab({name : R.t("Current"), value : "CURRENT", icon : ICON.CART},
             ff1);

    let ff2 = new FvcHistory();
    f.addTab({name : R.t("History"), value : "HISTORY", icon : ICON.ARTICLE},
             ff2);

    f.switchTo("CURRENT");
    return f;
  }
}

