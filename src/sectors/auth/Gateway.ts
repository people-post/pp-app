import { FvcWeb3Login } from './FvcWeb3Login.js';
import { FvcLogin } from './FvcLogin.js';
import { FvcLoginProxy } from './FvcLoginProxy.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SectorGateway, PageConfig } from '../../common/plt/SectorGateway.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Env } from '../../common/plt/Env.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

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
  createLoginView(nextView?: View): View {
    let v = new View();
    let f = this.#createLoginViewContentFragment();
    if (nextView && typeof (f as any).setNextView === 'function') {
      (f as any).setNextView(nextView);
    }
    v.setContentFragment(f);
    return v;
  }

  createWeb3LoginView(): View {
    let v = new View();
    let f = new FvcWeb3Login();
    v.setContentFragment(f);
    return v;
  }

  #createLoginViewContentFragment(): Fragment {
    let f: Fragment;
    if (Env.isTrustedSite() || WebConfig.isDevSite()) {
      f = new FvcLogin();
    } else {
      f = new FvcLoginProxy();
    }
    return f;
  }
}

