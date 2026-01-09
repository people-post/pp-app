import { WcSession } from './WcSession.js';
import { Gateway as AuthGateway } from '../sectors/auth/Gateway.js';
import { LvMain } from './LvMain.js';
import { View } from '../lib/ui/controllers/views/View.js';
import { FvcQuotaLimit } from '../common/gui/FvcQuotaLimit.js';
import { Tag } from '../common/datatypes/Tag.js';
import { T_ACTION } from '../common/plt/Events.js';
import { Events, T_DATA } from '../lib/framework/Events.js';
import { WebConfig } from '../common/dba/WebConfig.js';
import { Cart } from '../common/dba/Cart.js';
import { Notifications } from '../common/dba/Notifications.js';
import { Gateway as HrGateway } from '../sectors/hr/Gateway.js';
import { Env } from '../common/plt/Env.js';
import { AbAccount } from './AbAccount.js';

declare global {
  var api: {
    asyncRawCall(url: string, callback: (responseText: string) => void): void;
  };
}

export class WcMain extends WcSession {
  onLoginClickInAccountActionButtonFragment(_fAbAccount: AbAccount): void {
    let gw = new AuthGateway();
    let v = gw.createLoginView();
    this._pushView(v, "Login");
  }

  onLogoutClickInActionButtonFragment(_fAbAccount: AbAccount): void {
    // @ts-expect-error - api is a global
    api.asyncRawCall("/api/auth/logout", (r: string) => this.#onLogoutRRR(r));
  }

  topAction(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case T_ACTION.ACCOUNT_UPGRADE:
      this.#showUpgradeView(args[0] as unknown);
      break;
    case T_ACTION.SHOW_BLOG_ROLES:
      this.#showBlogRolesView();
      break;
    case T_ACTION.LOGIN_SUCCESS:
      this.#onLoginSuccess(args[0] as unknown, args[1] as View | undefined);
      break;
    default:
      super.topAction(type, ...args);
      break;
    }
  }

  _createLayerFragment(): LvMain { return new LvMain(); }

  _initLayer(lc: LvMain): void {
    let fAb = new AbAccount();
    fAb.setDelegate(this);
    lc.setDefaultActionButton(fAb);
    lc.setDefaultPageId(WebConfig.getHomeSector());
    super._initLayer(lc);
  }

  _initEventHandlers(): void {
    super._initEventHandlers();
    Cart.clear();
    Notifications.init();
  }

  _main(dConfig: unknown): void {
    super._main(dConfig);
    Env.checkLoadAddonScript(Env.SCRIPT.PLAYER);
    Env.checkLoadAddonScript(Env.SCRIPT.SIGNAL);
    Env.checkLoadAddonScript(Env.SCRIPT.EDITOR);
    Env.checkLoadAddonScript(Env.SCRIPT.PAYMENT);
    Env.checkLoadAddonScript(Env.SCRIPT.BRAINTREE);
  }

  #showUpgradeView(quotaError: unknown): void {
    let v = new View();
    v.setContentFragment(new FvcQuotaLimit(quotaError));
    this._pushDialog(v, "Quota limit");
  }

  #onLoginSuccess(profile: unknown, nextView: View | undefined): void {
    let urlParam = new URLSearchParams(window.location.search);

    window.dba.Account?.reset?.(profile);
    this._clearDbAgents();

    this._initLanguage();
    this._getTopLayerFragment().init();
    this.initFromUrl(urlParam);
    if (nextView) {
      this._pushView(nextView, "Auto next");
    }
  }

  #showBlogRolesView(): void {
    let v = new View();
    let gw = new HrGateway();
    let f = gw.createMainViewContentFragment();
    f.switchTo(Tag.T_ID.BLOG);
    v.setContentFragment(f);
    this._pushDialog(v, "Blog open roles");
  }

  #onLogoutRRR(responseText: string): void {
    let response = JSON.parse(responseText) as { error?: unknown };
    if (response.error) {
      Events.trigger(T_DATA.REMOTE_ERROR, response.error);
    } else {
      location.replace(WebConfig.getHomeUrl());
    }
  }
}

export default WcMain;
