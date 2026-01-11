import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import type { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { ICON } from '../../common/constants/Icons.js';
import { SectorGateway, PageConfig } from '../../common/plt/SectorGateway.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Web3Config } from '../../common/dba/Web3Config.js';
import { FvcWeb3OwnerPosts } from './FvcWeb3OwnerPosts.js';
import { FvcOwnerPosts } from './FvcOwnerPosts.js';
import { FvcReport } from './FvcReport.js';
import { FvcWeb3Explorer } from './FvcWeb3Explorer.js';
import { FvcDrafts } from './FvcDrafts.js';
import { FvcConfig } from './FvcConfig.js';
import { FvcExplorer } from './FvcExplorer.js';
import { FvcWeb3Report } from './FvcWeb3Report.js';
import { R } from '../../common/constants/R.js';
import { Env } from '../../common/plt/Env.js';
import { Account } from '../../common/dba/Account.js';

const _CG_BLOG = {
  NEWS : {ID : "NEWS", NAME : "News", ICON : ICON.EXPLORER},
  OWNER_PUBLIC : {ID : "BLOG", NAME : "Blog", ICON : ICON.EXPLORER},
  OWNER : {ID : "ME", NAME : "Me", ICON : ICON.SMILEY},
  DRAFTS : {ID : "DRAFTS", NAME : "Drafts", ICON : ICON.MANUSCRIPT},
  CONFIG : {ID : "CONFIG", NAME : "Config", ICON : ICON.CONFIG},
  REPORT : {ID : "REPORT", NAME : "Report", ICON : ICON.REPORT},
} as const;

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
    case _CG_BLOG.REPORT.ID:
      n = Notifications.getNBlogNotifications();
      break;
    default:
      break;
    }
    return n;
  }

  createMainViewContentFragment(): FViewContentBase {
    if (Env.isWeb3()) {
      if (Account.isAuthenticated()) {
        return this.#createMainViewContentFragmentForWeb3Owner();
      } else {
        return this.#createMainViewContentFragmentForWeb3Guest();
      }
    } else {
      if (Account.isAuthenticated()) {
        if (Account.isWebOwner()) {
          return this.#createMainViewContentFragmentForOwner();
        } else {
          return this.#createMainViewContentFragmentForVisitor();
        }
      } else {
        return this.#createMainViewContentFragmentForGuest();
      }
    }
  }

  #createMainViewContentFragmentForWeb3Guest(): FViewContentBase {
    let f = new FvcWeb3OwnerPosts();
    f.setOwnerId(Web3Config.getGuestIdolId());
    return f;
  }

  #createMainViewContentFragmentForGuest(): FViewContentBase {
    let f = new FvcOwnerPosts();
    f.setOwnerId(WebConfig.getOwnerId());
    return f;
  }

  #createMainViewContentFragmentForVisitor(): FViewContentBase {
    let f = new FViewContentMux();
    f.setPreferredWidth({"min" : 320, "best" : 800, "max" : 0});
    f.setDataSource(this);

    let ff = new FvcOwnerPosts();
    ff.setOwnerId(WebConfig.getOwnerId());
    f.addTab(this.#makeTabConfig(_CG_BLOG.OWNER_PUBLIC), ff);

    ff = new FvcReport();
    f.addTab(this.#makeTabConfig(_CG_BLOG.REPORT), ff);

    f.switchTo(_CG_BLOG.OWNER_PUBLIC.ID);
    return f;
  }

  #createMainViewContentFragmentForWeb3Owner(): FViewContentBase {
    let f = new FViewContentMux();
    f.setPreferredWidth({"min" : 320, "best" : 800, "max" : 0});
    f.setDataSource(this);

    let ff = new FvcWeb3Explorer();
    f.addTab(this.#makeTabConfig(_CG_BLOG.NEWS), ff);

    ff = new FvcWeb3OwnerPosts();
    ff.setOwnerId(Account.getId());
    f.addTab(this.#makeTabConfig(_CG_BLOG.OWNER), ff);

    ff = new FvcWeb3Report();
    f.addTab(this.#makeTabConfig(_CG_BLOG.REPORT), ff);

    f.switchTo(_CG_BLOG.NEWS.ID);
    return f;
  }

  #createMainViewContentFragmentForOwner(): FViewContentBase {
    let f = new FViewContentMux();
    f.setPreferredWidth({"min" : 320, "best" : 800, "max" : 0});
    f.setDataSource(this);

    let ff = new FvcExplorer();
    f.addTab(this.#makeTabConfig(_CG_BLOG.NEWS), ff);

    ff = new FvcOwnerPosts();
    ff.setOwnerId(WebConfig.getOwnerId());
    f.addTab(this.#makeTabConfig(_CG_BLOG.OWNER), ff);

    ff = new FvcDrafts();
    f.addTab(this.#makeTabConfig(_CG_BLOG.DRAFTS), ff);

    ff = new FvcConfig();
    f.addTab(this.#makeTabConfig(_CG_BLOG.CONFIG), ff);

    ff = new FvcReport();
    f.addTab(this.#makeTabConfig(_CG_BLOG.REPORT), ff);

    f.switchTo(_CG_BLOG.NEWS.ID);
    return f;
  }

  #makeTabConfig(c: {NAME: string; ID: string; ICON: string}): {name: string; value: string; icon: string} {
    return {name : R.t(c.NAME), value : c.ID, icon : c.ICON};
  }
}
