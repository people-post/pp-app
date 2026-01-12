import { FvcWeb2LoginBase } from './FvcWeb2LoginBase.js';
import { FvcRegister } from './FvcRegister.js';
import { FvcRetrievePassword } from './FvcRetrievePassword.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Auth } from '../../common/dba/Auth.js';
import { R } from '../../common/constants/R.js';

export const CF_LOGIN = {
  REGISTER : "CF_LOGIN_1",
  RETRIEVE_PASSWORD : "CF_LOGIN_2",
  ON_USERNAME_KEY_DOWN : "CF_LOGIN_3",
  ON_PASSWD_KEY_DOWN : "CF_LOGIN_4",
};

const _CFT_LOGIN = {
  FORM : `<div class="flex flex-column center-align-items">
  <div>
    <div><label class="s-font5" for="username">__R_U_NAME__:</label></div>
    <div><input id="username" name="username" type="text" autocomplete="username" placeholder="__R_U_NAME_HINT__" onkeydown="javascript:G.action('${CF_LOGIN.ON_USERNAME_KEY_DOWN}')"></div>
    <div><label class="s-font5" for="password">__R_PASS__:</label></div>
    <div><input id="password" name="password" type="password" autocomplete="current-password" placeholder="__R_PASS_HINT__" onkeydown="javascript:G.action('${CF_LOGIN.ON_PASSWD_KEY_DOWN}', this)"></div>
    <div>
      <a class="s-font7" href="javascript:void(0)" onclick="javascript:G.action('${CF_LOGIN.RETRIEVE_PASSWORD}')">__R_FORGET_PASS__?</a>
      <span class="s-font7">__R_NO_ACCOUNT__?</span>
      <a class="s-font7" href="javascript:void(0)" onclick="javascript:G.action('${CF_LOGIN.REGISTER}')">__R_REGISTER__.</a>
    </div>
  </div>
  </div>`,
  SKIP_TEXT : `<div class="center-align">or<div>`,
};

export class FvcLogin extends FvcWeb2LoginBase {
  #btnLogin: Button;
  #btnSkip: Button;
  constructor() {
    super();
    this.#btnLogin = new Button();
    this.#btnLogin.setName(R.t("Login"));
    this.#btnLogin.setValue("LOGIN");
    this.#btnLogin.setDelegate(this);
    this.setChild("btnLogin", this.#btnLogin);

    this.#btnSkip = new Button();
    this.#btnSkip.setName("Continue as guest");
    this.#btnSkip.setValue("SKIP");
    this.#btnSkip.setDelegate(this);
    this.setChild("btnSkip", this.#btnSkip);
  }

  onSimpleButtonClicked(fBtn: Button): void {
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

  action(type: symbol, ...args: unknown[]): void {
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
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.LOGIN:
      this.#onActionFinished();
      break;
    default:
      super.handleSessionDataUpdate(dataType, data);
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    p.pushSpace(1);

    // Title
    let pp = new Panel();
    pp.setClassName("center-align");
    p.pushPanel(pp);

    let targetInfo = Auth.getProxyTarget();
    let title = R.t("Sign-In");
    if (targetInfo) {
      title = R.t("Sign-In to") + ": " + targetInfo.toDomain;
    }
    pp.replaceContent(title);
    p.pushSpace(1);

    // Login form
    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderForm());
    p.pushSpace(1);

    pp = new Panel();
    p.pushPanel(pp);
    this.#btnLogin.attachRender(pp);
    this.#btnLogin.render();

    // Skip
    if (this._nextView) {
      pp = new Panel();
      p.pushPanel(pp);
      p.pushSpace(1);
      pp.replaceContent(_CFT_LOGIN.SKIP_TEXT);
      pp = new PanelWrapper();
      p.pushPanel(pp);
      this.#btnSkip.attachRender(pp);
      this.#btnSkip.render();
      p.pushSpace(1);
    }

    p.pushSpace(2);
  }

  #renderForm(): string {
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

  #onLoginClicked(): void {
    let e = this.#getUsernameInputElement();
    let username = e.value;
    e = this.#getPasswordInputElement();
    let password = e.value;
    Auth.asyncLogin(username, password, r => this._onLoginSuccess(r));
  }

  #onRegister(): void {
    let v = new View();
    v.setContentFragment(new FvcRegister());
    this._owner.onFragmentRequestShowView(this, v, "Register");
  }

  #onRetrievePassword(): void {
    let v = new View();
    v.setContentFragment(new FvcRetrievePassword());
    this._owner.onFragmentRequestShowView(this, v, "Retrieve password");
  }

  #onSkip(): void { this.#onActionFinished(); }

  #onActionFinished(): void {
    // Login skipped
    if (this._nextView) {
      this._owner.onContentFragmentRequestReplaceView(this, this._nextView,
                                                      "Next");
    } else {
      this._owner.onContentFragmentRequestPopView(this);
    }
  }

  #getUsernameInputElement(): HTMLInputElement { return document.getElementById("username") as HTMLInputElement; }
  #getPasswordInputElement(): HTMLInputElement { return document.getElementById("password") as HTMLInputElement; }

  #onUsernameKeyDown(): void {
    if (this.#isEnterEvt(event as KeyboardEvent)) {
      let e = this.#getPasswordInputElement();
      e.focus();
    }
  }

  #onPasswordKeyDown(): void {
    if (this.#isEnterEvt(event as KeyboardEvent)) {
      this.#onLoginClicked();
    }
  }

  #isEnterEvt(evt: KeyboardEvent): boolean { return !evt.shiftKey && evt.key === "Enter";   }
}
