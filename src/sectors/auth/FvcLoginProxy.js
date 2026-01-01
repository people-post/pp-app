import { FvcWeb2LoginBase } from './FvcWeb2LoginBase.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { api } from '../../common/plt/Api.js';

export const CF_LOGIN_PROXY = {
  TRIGGER_CHECK : Symbol(),
};

const _CFT_LOGIN_PROXY = {
  OPTIONS :
      `left=__LEFT__,top=__TOP__,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=320,height=480`,
};

export class FvcLoginProxy extends FvcWeb2LoginBase {
  constructor() {
    super();
    this._fBtn = new Button();
    this._fBtn.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this._fBtn.setDelegate(this);
    this._fBtn.setName(R.t("Login through gcabin.com"));
    this.setChild("btn", this._fBtn);

    this._pMsg = null;
    this._pContent = null;
    this._token = null;
  }

  onSimpleButtonClicked(fButton) {
    // Event driven open window, don't do async work here
    this.#startProxy(this._token);
  }

  action(type, ...args) {
    switch (type) {
    case auth.CF_LOGIN_PROXY.TRIGGER_CHECK:
      this.#asyncCheckToken(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _onContentDidAppear() {
    if (!this._token) {
      this.#asyncRequestLoginToken();
    }
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new Panel();
    p.pushPanel(pp);
    pp.setClassName("info-message");
    this._pMsg = pp;

    p.pushSpace(1);
    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(R.get("PROXY_LOGIN_PROMPT"));
    this._pContent = pp;

    p.pushSpace(1);
    pp = new Panel();
    p.pushPanel(pp);
    this._fBtn.attachRender(pp);
    this._fBtn.render();

    p.pushSpace(2);

    // Start with disabled state
    this._fBtn.disable();
  }

  #onTokenReady(token) {
    this._token = token;
    this._fBtn.enable();
  }

  #startProxy(token) {
    let params = [
      C.URL_PARAM.SECTOR + "=" + C.ID.SECTOR.LOGIN,
      C.URL_PARAM.TOKEN + "=" + token,
      C.URL_PARAM.FROM_DOMAIN + "=" + Utilities.getTopLevelDomain()
    ];
    let url = dba.WebConfig.getLoginProxyUrl() + "/" + C.ID.SECTOR.GADGET +
              "?" + params.join("&");
    let opt = _CFT_LOGIN_PROXY.OPTIONS;
    opt = opt.replace("__LEFT__", window.screenX + window.outerWidth / 2);
    opt = opt.replace("__TOP__", window.screenY + 100);
    window.open(url, 'login', opt);
    this.#onStart(token);
  }

  #onStart(token) {
    this._pMsg.setVisible(true);
    this._pMsg.replaceContent(R.get("PROXY_MSG_WAITING_LOG_IN"));
    this._asyncActivateToken(token);
  }

  #onReady(token) {
    this._pMsg.replaceContent(R.get("PROXY_MSG_LOGGING_IN"));
    dba.Auth.asyncLoginWithToken(token, r => this.#onLoginRRR(r));
  }

  #onLoginError(err) {
    this._token = null;
    this._owner.onRemoteErrorInFragment(this, err);
    this.#asyncRequestLoginToken();
  }

  #onLoginSuccess(profile) {
    this._pMsg.replaceContent(R.get("PROXY_MSG_LOGIN_SUCCESS"));
    this._onLoginSuccess(profile);
  }

  #onLoginRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this.#onLoginError(response.error);
    } else {
      this.#onLoginSuccess(response.data.profile);
    }
  }

  #asyncRequestLoginToken() {
    this._pMsg.replaceContent(R.get("PROXY_MSG_INITING"));
    let url = "/api/auth/login_token";
    api.asyncRawCall(url, r => this.#onLoginTokenRRR(r));
  }

  #onLoginTokenRRR(responseText) {
    this._pMsg.replaceContent("");
    this._pMsg.setVisible(false);
    let response = JSON.parse(responseText);
    if (response.error) {
      this._owner.onRemoteErrorInFragment(this, response.error);
    } else {
      this.#onTokenReady(response.data.token);
    }
  }

  #scheduleCheck(time, token) {
    fwk.Events.scheduleAction(time, this, auth.CF_LOGIN_PROXY.TRIGGER_CHECK,
                              token);
  }

  _asyncActivateToken(token) {
    let url = "/api/auth/activate_login_token";
    let fd = new FormData();
    fd.append("token", token);
    api.asyncRawPost(url, fd, r => this.#onActivateTokenRRR(token, r));
  }

  #onActivateTokenRRR(token, responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this.#onLoginError(response.error);
    } else {
      this.#scheduleCheck(5000, token);
    }
  }

  #asyncCheckToken(token) {
    let url = "/api/auth/check_login_token";
    let fd = new FormData();
    fd.append("token", token);
    api.asyncRawPost(url, fd, r => this.#onTokenCheckRRR(token, r));
  }

  #onTokenCheckRRR(token, responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this.#onLoginError(response.error);
    } else {
      if (response.data.is_ready) {
        this.#onReady(token);
      } else {
        this.#scheduleCheck(2000, token);
      }
    }
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.auth = window.auth || {};
  window.auth.CF_LOGIN_PROXY = CF_LOGIN_PROXY;
  window.auth.FvcLoginProxy = FvcLoginProxy;
}