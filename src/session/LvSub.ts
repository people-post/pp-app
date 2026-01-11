import { LvTabbedPage } from './LvTabbedPage.js';
import { FHomeBtn } from './FHomeBtn.js';
import { URL_PARAM } from '../common/constants/Constants.js';
import { WebConfig } from '../common/dba/WebConfig.js';
import { Gateway as AuthGateway } from '../sectors/auth/Gateway.js';
import { Api } from '../common/plt/Api.js';
import { AbAccount } from './AbAccount.js';
import { Account } from '../common/dba/Account.js';

export class LvSub extends LvTabbedPage {
  initFromUrl(urlParam: URLSearchParams): void {
    this.setSectorId(urlParam.get(URL_PARAM.SECTOR) || "");
    let pageId = urlParam.get(URL_PARAM.PAGE);

    if (this._gateway.isLoginRequired()) {
      let fAb = new AbAccount();
      fAb.setDelegate(this as any);
      this.setDefaultActionButton(fAb);
    }

    let icon = this._gateway.getIcon();
    if (icon) {
      this.#initHomeBtn(icon);
    }
    let f = this._gateway.getBannerFragment();
    if (f) {
      if (this._owner) {
        (this._owner as any).onLayerFragmentRequestSetBannerFragment(this, f);
      }
    }

    let configs = this._gateway.getPageConfigs();
    if (this._pMain) {
      this._pMain.setEnableNavPanel(configs.length > 1);
    }

    this.onResize();
    if (this._pMain) {
      this._vc.replaceNavWrapperPanel(this._pMain.getNavWrapperPanel?.() ?? null);
    }

    this._vc.init(configs);
    this.setDefaultPageId(this._gateway.getDefaultPageId());

    // Switch before call page initFromUrl
    if (pageId) {
      this._vc.switchToPage(pageId);
    }
    this._vc.initFromUrl(urlParam);

    if (this._gateway.isLoginRequired() && !(Account.isAuthenticated() || false)) {
      this.#onLogin();
    }
  }

  getUrlParamString(): string {
    let params: string[] = [
      URL_PARAM.SECTOR + "=" + this.getSectorId(),
      URL_PARAM.PAGE + "=" + this._vc.getActivePageId()
    ];
    let s = this._vc.getUrlParamString();
    if (s.length > 0) {
      params.push(s);
    }
    return params.join("&");
  }

  onLoginClickInAccountActionButtonFragment(_fAbAccount: AbAccount): void { this.#onLogin(); }

  onLogoutClickInActionButtonFragment(_fAbAccount: AbAccount): void {
    Api.asCall("/api/auth/logout")
        .then((d: unknown) => this.#onLogoutRRR(d));
  }

  #onLogin(): void {
    let gw = new AuthGateway();
    let v = gw.createLoginView();
    if (this._owner) {
      (this._owner as any).onFragmentRequestShowView(this, v, "Login");
    }
  }

  #onLogoutRRR(_data: any): void {
      location.replace(WebConfig.getSubUrl(this.getSectorId()));
  }

  #initHomeBtn(icon: string): void {
    let f = new FHomeBtn();
    f.setIcon(icon);
    f.setUrl(WebConfig.getSubUrl(this.getSectorId()));
    this.setHomeBtnFragment(f);
  }
}

