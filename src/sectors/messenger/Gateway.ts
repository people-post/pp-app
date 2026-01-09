import { FvcChatThreadList } from './FvcChatThreadList.js';
import { FvcContactList } from './FvcContactList.js';
import { FvcChatGroupList } from './FvcChatGroupList.js';
import { FvcMessengerNoticeList } from './FvcMessengerNoticeList.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import type { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { SectorGateway, PageConfig } from '../../common/plt/SectorGateway.js';
import { Notifications } from '../../common/dba/Notifications.js';
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
  getNTabNoticesForViewContentMuxFragment(_fMux: FViewContentMux, v: string): number {
    let n = 0;
    switch (v) {
    case "THREADS":
      n = Notifications.getNMessages();
      break;
    case "NOTICES":
      n = Notifications.getNMessengerNotices();
      break;
    default:
      break;
    }
    return n;
  }

  createMainViewContentFragment(): FViewContentBase {
    let f = new FViewContentMux();
    f.setDataSource(this);

    let ff = new FvcChatThreadList();
    f.addTab({name : R.t("Chats"), value : "THREADS", icon : ICON.CHAT}, ff);

    ff = new FvcContactList();
    f.addTab(
        {name : R.t("Contacts"), value : "CONTACTS", icon : ICON.CONTACT},
        ff);

    ff = new FvcChatGroupList();
    f.addTab({name : R.t("Groups"), value : "GROUPS", icon : ICON.GROUP}, ff);

    ff = new FvcMessengerNoticeList();
    f.addTab({name : R.t("Notices"), value : "NOTICES", icon : ICON.BELL},
             ff);

    f.switchTo("THREADS");
    return f;
  }
};
