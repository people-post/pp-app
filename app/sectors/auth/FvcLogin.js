import { FvcWeb2LoginBase } from './FvcWeb2LoginBase.js';
import { FvcRegister } from './FvcRegister.js';
import { FvcRetrievePassword } from './FvcRetrievePassword.js';

export const CF_LOGIN = {
  REGISTER : Symbol(),
  RETRIEVE_PASSWORD : Symbol(),
  ON_USERNAME_KEY_DOWN : Symbol(),
  ON_PASSWD_KEY_DOWN : Symbol(),
};

const _CFT_LOGIN = {
  FORM : `<div class="flex flex-column center-align-items">
  <div>
    <div><label class="s-font5" for="username">__R_U_NAME__:</label></div>
    <div><input id="username" name="username" type="text" autocomplete="username" placeholder="__R_U_NAME_HINT__" onkeydown="javascript:G.action(auth.CF_LOGIN.ON_USERNAME_KEY_DOWN)"></div>
    <div><label class="s-font5" for="password">__R_PASS__:</label></div>
    <div><input id="password" name="password" type="password" autocomplete="current-password" placeholder="__R_PASS_HINT__" onkeydown="javascript:G.action(auth.CF_LOGIN.ON_PASSWD_KEY_DOWN, this)"></div>
    <div>
      <a class="s-font7" href="javascript:void(0)" onclick="javascript:G.action(auth.CF_LOGIN.RETRIEVE_PASSWORD)">__R_FORGET_PASS__?</a>
      <span class="s-font7">__R_NO_ACCOUNT__?</span>
      <a class="s-font7" href="javascript:void(0)" onclick="javascript:G.action(auth.CF_LOGIN.REGISTER)">__R_REGISTER__.</a>
    </div>
  </div>
  </div>`,
  SKIP_TEXT : `<div class="center-align">or<div>`,
};

export class FvcLogin extends FvcWeb2LoginBase {
  #btnLogin;
  #btnSkip;
  constructor() {
    super();
    this.#btnLogin = new ui.Button();
    this.#btnLogin.setName(R.t("Login"));
    this.#btnLogin.setValue("LOGIN");
    this.#btnLogin.setDelegate(this);
    this.setChild("btnLogin", this.#btnLogin);

    this.#btnSkip = new ui.Button();
    this.#btnSkip.setName("Continue as guest");
    this.#btnSkip.setValue("SKIP");
    this.#btnSkip.setDelegate(this);
    this.setChild("btnSkip", this.#btnSkip);
  }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn.getValue()) {
    case "LOGIN":
      this.#onLoginClicked();
      break;
    case "SKIP":
      this.#onSkip();
      break;
    default:
      break;
    }
  }

  action(type, ...args) {
    switch (type) {
    case CF_LOGIN.REGISTER:
      this.#onRegister();
      break;
    case CF_LOGIN.ON_USERNAME_KEY_DOWN:
      this.#onUsernameKeyDown();
      break;
    case CF_LOGIN.ON_PASSWD_KEY_DOWN:
      this.#onPasswordKeyDown();
      break;
    case CF_LOGIN.RETRIEVE_PASSWORD:
      this.#onRetrievePassword();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.LOGIN:
      this.#onActionFinished();
      break;
    default:
      super.handleSessionDataUpdate.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    p.pushSpace(1);

    // Title
    let pp = new ui.Panel();
    pp.setClassName("center-align");
    p.pushPanel(pp);

    let targetInfo = dba.Auth.getProxyTarget();
    let title = R.t("Sign-In");
    if (targetInfo) {
      title = R.t("Sign-In to") + ": " + targetInfo.toDomain;
    }
    pp.replaceContent(title);
    p.pushSpace(1);

    // Login form
    pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderForm());
    p.pushSpace(1);

    pp = new ui.Panel();
    p.pushPanel(pp);
    this.#btnLogin.attachRender(pp);
    this.#btnLogin.render();

    // Skip
    if (this._nextView) {
      pp = new ui.Panel();
      p.pushPanel(pp);
      p.pushSpace(1);
      pp.replaceContent(_CFT_LOGIN.SKIP_TEXT);
      pp = new ui.PanelWrapper();
      p.pushPanel(pp);
      this.#btnSkip.attachRender(pp);
      this.#btnSkip.render();
      p.pushSpace(1);
    }

    p.pushSpace(2);
  }

  #renderForm() {
    let s = _CFT_LOGIN.FORM;
    s = s.replace("__R_U_NAME__", R.t("Email") + "/" + R.t("Username"));
    s = s.replace("__R_U_NAME_HINT__", R.t("Email") + "/" + R.t("Username"));
    s = s.replace("__R_PASS__", R.t("Password"));
    s = s.replace("__R_PASS_HINT__", R.t("Password"));
    s = s.replace("__R_REGISTER__", R.t("Register"));
    s = s.replace("__R_FORGET_PASS__", R.get("FORGET_PASS"));
    s = s.replace("__R_NO_ACCOUNT__", R.get("NO_ACCOUNT"));
    return s;
  }

  #onLoginClicked() {
    let e = this.#getUsernameInputElement();
    let username = e.value;
    e = this.#getPasswordInputElement();
    let password = e.value;
    dba.Auth.asyncLogin(username, password, r => this._onLoginSuccess(r));
  }

  #onRegister() {
    let v = new ui.View();
    v.setContentFragment(new FvcRegister());
    this._owner.onFragmentRequestShowView(this, v, "Register");
  }

  #onRetrievePassword() {
    let v = new ui.View();
    v.setContentFragment(new FvcRetrievePassword());
    this._owner.onFragmentRequestShowView(this, v, "Retrieve password");
  }

  #onSkip() { this.#onActionFinished(); }

  #onActionFinished() {
    // Login skipped
    if (this._nextView) {
      this._owner.onContentFragmentRequestReplaceView(this, this._nextView,
                                                      "Next");
    } else {
      this._owner.onContentFragmentRequestPopView(this);
    }
  }

  #getUsernameInputElement() { return document.getElementById("username"); }
  #getPasswordInputElement() { return document.getElementById("password"); }

  #onUsernameKeyDown() {
    if (this.#isEnterEvt(event)) {
      let e = this.#getPasswordInputElement();
      e.focus();
    }
  }

  #onPasswordKeyDown() {
    if (this.#isEnterEvt(event)) {
      this.#onLoginClicked();
    }
  }

  #isEnterEvt(evt) { return !evt.shiftKey && evt.key === "Enter";   }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.auth = window.auth || {};
  window.auth.CF_LOGIN = CF_LOGIN;
  window.auth.FvcLogin = FvcLogin;
}