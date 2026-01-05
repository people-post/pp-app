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
    lc.setDefaultPageId(WebConfig.getHomeSector());
    super._initLayer(lc);
  }

  _initEventHandlers() {
    super._initEventHandlers();
    Cart.clear();
    Notifications.init();
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

    window.dba.Account.reset(profile);
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
    let gw = new HrGateway();
    let f = gw.createMainViewContentFragment();
    f.switchTo(Tag.T_ID.BLOG);
    v.setContentFragment(f);
    this._pushDialog(v, "Blog open roles");
  }

  #onLogoutRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      Events.trigger(T_DATA.REMOTE_ERROR, response.error);
    } else {
      location.replace(WebConfig.getHomeUrl());
    }
  }
};
