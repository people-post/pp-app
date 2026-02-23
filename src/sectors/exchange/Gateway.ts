import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { FvcWeb3Exchange } from './FvcWeb3Exchange.js';
import { FvcExchange } from './FvcExchange.js';
import { FvcWallet } from './FvcWallet.js';
import { SectorGateway, PageConfig } from '../../common/plt/SectorGateway.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';
import { Env } from '../../common/plt/Env.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Account } from '../../common/dba/Account.js';
import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';

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
    if (Env.isWeb3()) {
      return this.#createWeb3MainViewContentFragment();
    } else {
      return this.#createWeb2MainViewContentFragment();
    }
  }

  #createWeb3MainViewContentFragment(): FViewContentBase { return new FvcWeb3Exchange(); }

  #createWeb2MainViewContentFragment(): FViewContentBase {
    if (Account.isWebOwner()) {
      let f = new FViewContentMux();

      let ff: FViewContentBase = new FvcExchange();
      f.addTab({name : R.t("Market"), value : "MARKET", icon : ICON.EXPLORER},
               ff);

      ff = new FvcWallet();
      f.addTab({name : R.t("Wallet"), value : "WALLET", icon : ICON.WALLET},
               ff);

      f.switchTo("MARKET");
      return f;
    } else {
      return new FvcExchange();
    }
  }
};
