import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import type { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { FvcInbox } from './FvcInbox.js';
import { FvcConfig } from './FvcConfig.js';
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
  createMainViewContentFragment(): FViewContentBase {
    let f = new FViewContentMux();

    let ff = new FvcInbox();
    f.addTab({name : R.t("Inbox"), value : "INBOX", icon : ICON.EMAIL}, ff);

    ff = new FvcConfig();
    f.addTab({name : R.t("Config"), value : "CONFIG", icon : ICON.CONFIG},
             ff);

    f.switchTo("INBOX");
    return f;
  }
};
