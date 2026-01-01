import { WcSession } from './WcSession.js';
import { Gateway as AuthGateway } from '../sectors/auth/Gateway.js';
import { LvMain } from './LvMain.js';
import { AbAccount } from './AbAccount.js';
import { View } from '../lib/ui/controllers/views/View.js';
import { FvcQuotaLimit } from '../common/gui/FvcQuotaLimit.js';
import { Tag } from '../common/datatypes/Tag.js';
import { api } from '../common/plt/Api.js';
import { T_ACTION } from '../common/plt/Events.js';

export class WcMain extends WcSession {
  onLoginClickInAccountActionButtonFragment(fAbAccount) {
    let gw = new AuthGateway();
    let v = gw.createLoginView();
    this._pushView(v, "Login");
  }

  onLogoutClickInActionButtonFragment(fAbAccount) {
    api.asyncRawCall("/api/auth/logout", r => this.#onLogoutRRR(r));
  }

  topAction(type, ...args) {
    switch (type) {
    case T_ACTION.ACCOUNT_UPGRADE:
      this.#showUpgradeView(args[0]);
      break;
    case T_ACTION.SHOW_BLOG_ROLES:
      this.#showBlogRolesView();
      break;
    case T_ACTION.LOGIN_SUCCESS:
      this.#onLoginSuccess(args[0], args[1]);
      break;
    default:
      super.topAction.apply(this, arguments);
      break;
    }
  }

  _createLayerFragment() { return new LvMain(); }

  _initLayer(lc) {
    let fAb = new AbAccount();
    fAb.setDelegate(this);
    lc.setDefaultActionButton(fAb);
    lc.setDefaultPageId(dba.WebConfig.getHomeSector());
    super._initLayer(lc);
  }

  _initEventHandlers() {
    super._initEventHandlers();
    dba.Cart.clear();
    dba.Notifications.init();
  }

  _main(dConfig) {
    super._main(dConfig);
    glb.env.checkLoadAddonScript(glb.env.SCRIPT.PLAYER);
    glb.env.checkLoadAddonScript(glb.env.SCRIPT.SIGNAL);
    glb.env.checkLoadAddonScript(glb.env.SCRIPT.EDITOR);
    glb.env.checkLoadAddonScript(glb.env.SCRIPT.PAYMENT);
    glb.env.checkLoadAddonScript(glb.env.SCRIPT.BRAINTREE);
  }

  #showUpgradeView(quotaError) {
    let v = new View();
    v.setContentFragment(new FvcQuotaLimit(quotaError));
    this._pushDialog(v, "Quota limit");
  }

  #onLoginSuccess(profile, nextView) {
    let urlParam = new URLSearchParams(window.location.search);

    dba.Account.reset(profile);
    this._clearDbAgents();

    this._initLanguage();
    this._getTopLayerFragment().init();
    this.initFromUrl(urlParam);
    if (nextView) {
      this._pushView(nextView, "Auto next");
    }
  }

  #showBlogRolesView() {
    let v = new View();
    let gw = new hr.Gateway();
    let f = gw.createMainViewContentFragment();
    f.switchTo(Tag.T_ID.BLOG);
    v.setContentFragment(f);
    this._pushDialog(v, "Blog open roles");
  }

  #onLogoutRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      location.replace(dba.WebConfig.getHomeUrl());
    }
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.main = window.main || {};
  window.main.WcMain = WcMain;
}
