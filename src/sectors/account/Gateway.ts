import { FvcWeb3Basic } from './FvcWeb3Basic.js';
import { FvcStatistics } from './FvcStatistics.js';
import { FvcAddressList } from './FvcAddressList.js';
import { FvcBasic } from './FvcBasic.js';
import { FvcCloudFiles } from './FvcCloudFiles.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import type { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { SectorGateway, PageConfig } from '../../common/plt/SectorGateway.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';
import { Env } from '../../common/plt/Env.js';
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
    if (Env.isWeb3()) {
      return this.#createWeb3MainViewContentFragment();
    } else {
      return this.#createWeb2MainViewContentFragment();
    }
  }

  #createWeb3MainViewContentFragment(): FViewContentBase {
    return new FvcWeb3Basic();
  }

  #createWeb2MainViewContentFragment(): FViewContentBase {
    let f = new FViewContentMux();

    let ff = new FvcStatistics();
    f.addTab({name : R.t("Statistics"), value : "REPORT", icon : ICON.REPORT},
             ff);

    ff = new FvcAddressList();
    f.addTab({name : R.t("Addresses"), value : "ADDRESSES", icon : ICON.TAG},
             ff);

    ff = new FvcBasic();
    f.addTab({name : R.t("Settings"), value : "CONFIG", icon : ICON.CONFIG},
             ff);

    ff = new FvcCloudFiles();
    f.addTab({name : R.t("Files"), value : "FILES", icon : ICON.FILES}, ff);

    f.switchTo("REPORT");
    return f;
  }
}
