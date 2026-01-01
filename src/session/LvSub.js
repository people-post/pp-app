import { LvTabbedPage } from './LvTabbedPage.js';
import { api } from '../common/plt/Api.js';
import { AbAccount } from './AbAccount.js';
import { FHomeBtn } from './FHomeBtn.js';
import { URL_PARAM } from '../common/constants/Constants.js';
import { Account } from '../common/dba/Account.js';
import { WebConfig } from '../common/dba/WebConfig.js';
import { Gateway as AuthGateway } from '../sectors/auth/Gateway.js';

export class LvSub extends LvTabbedPage {
  initFromUrl(urlParam) {
    this.setSectorId(urlParam.get(URL_PARAM.SECTOR));
    let pageId = urlParam.get(URL_PARAM.PAGE);

    if (this._gateway.isLoginRequired()) {
      let fAb = new AbAccount();
      fAb.setDelegate(this);
      this.setDefaultActionButton(fAb);
    }

    let icon = this._gateway.getIcon();
    if (icon) {
      this.#initHomeBtn(icon);
    }
    let f = this._gateway.getBannerFragment();
    if (f) {
      this._owner.onLayerFragmentRequestSetBannerFragment(this, f);
    }

    let configs = this._gateway.getPageConfigs();
    this._pMain.setEnableNavPanel(configs.length > 1);

    this.onResize();
    this._vc.replaceNavWrapperPanel(this._pMain.getNavWrapperPanel());

    this._vc.init(configs);
    this.setDefaultPageId(this._gateway.getDefaultPageId());

    // Switch before call page initFromUrl
    this._vc.switchToPage(pageId);
    this._vc.initFromUrl(urlParam);

    if (this._gateway.isLoginRequired() && !Account.isAuthenticated()) {
      this.#onLogin();
    }
  }

  getUrlParamString() {
    let params = [
      URL_PARAM.SECTOR + "=" + this.getSectorId(),
      URL_PARAM.PAGE + "=" + this._vc.getActivePageId()
    ];
    let s = this._vc.getUrlParamString();
    if (s.length > 0) {
      params.push(s);
    }
    return params.join("&");
  }

  onLoginClickInAccountActionButtonFragment(fAbAccount) { this.#onLogin(); }

  onLogoutClickInActionButtonFragment(fAbAccount) {
    api.asyncFragmentCall(this, "/api/auth/logout")
        .then(d => this.#onLogoutRRR(d));
  }

  #onLogin() {
    let gw = new AuthGateway();
    let v = gw.createLoginView();
    this._owner.onFragmentRequestShowView(this, v, "Login");
  }

  #onLogoutRRR(data) {
      location.replace(WebConfig.getSubUrl(this.getSectorId()));
  }

  #initHomeBtn(icon) {
    let f = new FHomeBtn();
    f.setIcon(icon);
    f.setUrl(WebConfig.getSubUrl(this.getSectorId()));
    this.setHomeBtnFragment(f);
  }
};

