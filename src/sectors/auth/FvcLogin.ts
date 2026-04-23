import { FvcWeb2LoginBase } from './FvcWeb2LoginBase.js';
import { FvcRegister } from './FvcRegister.js';
import { FvcRetrievePassword } from './FvcRetrievePassword.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Auth } from '../../common/dba/Auth.js';
import { R } from '../../common/constants/R.js';

const CF_LOGIN = {
  REGISTER : "CF_LOGIN_1",
  RETRIEVE_PASSWORD : "CF_LOGIN_2",
  ON_USERNAME_KEY_DOWN : "CF_LOGIN_3",
  ON_PASSWD_KEY_DOWN : "CF_LOGIN_4",
  TOGGLE_PASSWORD : "CF_LOGIN_6",
};

const _CFT_LOGIN = {
  FIELD_CLASS :
      "tw:w-full tw:min-h-[48px] tw:rounded-lg tw:border tw:border-solid tw:border-lightgray tw:bg-white tw:px-3 tw:py-2.5 tw:text-s-font5 tw:outline-none tw:transition-colors tw:focus-visible:border-slate-400 tw:focus-visible:ring-2 tw:focus-visible:ring-slate-300/60",
  CARD_TOP :
      "tw:w-full tw:max-w-sm tw:mx-auto tw:rounded-t-2xl tw:border tw:border-solid tw:border-lightgray/90 tw:border-b-0 tw:bg-white tw:px-6 tw:pt-6 tw:pb-4",
  CARD_BUTTON :
      "tw:w-full tw:max-w-sm tw:mx-auto tw:border-x tw:border-t tw:border-solid tw:border-lightgray/90 tw:border-t-lightgray/70 tw:border-b-0 tw:bg-white tw:px-6 tw:py-3",
  CARD_BOTTOM :
      "tw:w-full tw:max-w-sm tw:mx-auto tw:rounded-b-2xl tw:border tw:border-solid tw:border-lightgray/90 tw:bg-white tw:px-6 tw:pb-6 tw:pt-5 tw:shadow-md tw:shadow-slate-300/25",
  FORM_FIELDS : `<div class="tw:space-y-6">
  <div class="tw:space-y-2">
    <label class="tw:block tw:text-s-font5 tw:font-medium tw:tracking-wide" for="username">__R_U_NAME__</label>
    <input id="username" name="username" type="text" autocomplete="username" class="__FIELD_CLASS__" placeholder="__R_U_NAME_HINT__" data-pp-keydown-action="${CF_LOGIN.ON_USERNAME_KEY_DOWN}">
  </div>
  <div class="tw:space-y-2">
    <label class="tw:block tw:text-s-font5 tw:font-medium tw:tracking-wide" for="password">__R_PASS__</label>
    <div class="tw:relative">
      <input id="password" name="password" type="password" autocomplete="current-password" class="__FIELD_CLASS__ tw:pr-18" placeholder="__R_PASS_HINT__" data-pp-keydown-action="${CF_LOGIN.ON_PASSWD_KEY_DOWN}">
      <a class="tw:absolute tw:right-1 tw:top-1/2 tw:-translate-y-1/2 tw:flex tw:min-h-[44px] tw:items-center tw:px-2 tw:text-s-font7 tw:text-sm" href="javascript:void(0)" data-pp-action="${CF_LOGIN.TOGGLE_PASSWORD}" id="login-toggle-password">__R_SHOW_PASS__</a>
    </div>
    <div class="tw:flex tw:justify-end tw:pt-0.5">
      <a class="tw:inline-flex tw:min-h-[44px] tw:items-center tw:text-s-font7 tw:text-sm tw:underline tw:underline-offset-4 tw:decoration-slate-400/80" href="javascript:void(0)" data-pp-action="${CF_LOGIN.RETRIEVE_PASSWORD}">__R_FORGET_PASS__</a>
    </div>
  </div>
</div>`,
  FORM_REGISTER : `<div class="tw:text-center tw:text-s-font7 tw:leading-relaxed">
    <span>__R_NO_ACCOUNT__</span>
    <a class="tw:font-medium tw:underline tw:underline-offset-4 tw:decoration-slate-400/80" href="javascript:void(0)" data-pp-action="${CF_LOGIN.REGISTER}">__R_REGISTER__</a>
  </div>`,
  SKIP_DIVIDER :
      `<div class="tw:flex tw:w-full tw:max-w-sm tw:mx-auto tw:items-center tw:gap-3 tw:py-1">
    <span class="tw:flex-1 tw:border-t tw:border-solid tw:border-lightgray/80"></span>
    <span class="tw:text-s-font7 tw:shrink-0">__R_OR_GUEST__</span>
    <span class="tw:flex-1 tw:border-t tw:border-solid tw:border-lightgray/80"></span>
  </div>`,
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
    this.#btnLogin.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#btnLogin.setThemeType(Button.T_THEME.PRIME);
    this.#btnLogin.setBarTailClassName(
        "tw:!ml-0 tw:!w-full tw:!max-w-none tw:min-h-[48px] tw:rounded-lg tw:shadow-sm");
    this.setChild("btnLogin", this.#btnLogin);

    this.#btnSkip = new Button();
    this.#btnSkip.setName("Continue as guest");
    this.#btnSkip.setValue("SKIP");
    this.#btnSkip.setDelegate(this);
    this.#btnSkip.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#btnSkip.setThemeType(Button.T_THEME.PALE);
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

  action(type: symbol | string, ...args: unknown[]): void {
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
    case CF_LOGIN.TOGGLE_PASSWORD:
      this.#onTogglePasswordVisibility();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContentOnRender(render: any): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    p.pushSpace(1);

    // Title
    let pp = new Panel();
    pp.setClassName(
        "tw:w-full tw:max-w-sm tw:mx-auto tw:text-center tw:space-y-2 tw:px-1 tw:pb-2");
    p.pushPanel(pp);

    let targetInfo = Auth.getProxyTarget();
    let titleHtml =
        `<div class="tw:text-s-font005 tw:font-bold tw:tracking-tight s-ctext">${R.t("Sign-In")}</div>` +
        `<div class="tw:text-s-font7 tw:text-sm">${R.t("Welcome back.")}</div>`;
    if (targetInfo) {
      titleHtml =
          `<div class="tw:text-s-font005 tw:font-bold tw:tracking-tight s-ctext">${R.t("Sign-In to")}</div>` +
          `<div class="tw:text-s-font7 tw:text-sm tw:break-all">${targetInfo.toDomain}</div>` +
          `<div class="tw:text-s-font7 tw:text-sm tw:pt-1">${R.t("You will access resources on this site.")}</div>`;
    }
    pp.replaceContent(titleHtml);
    p.pushSpace(1);

    // Login card: fields + Button (button-bar) + registration strip
    pp = new Panel();
    pp.setClassName(_CFT_LOGIN.CARD_TOP);
    p.pushPanel(pp);
    pp.replaceContent(this.#renderFormFields());

    pp = new Panel();
    pp.setClassName(_CFT_LOGIN.CARD_BUTTON);
    p.pushPanel(pp);
    this.#btnLogin.attachRender(pp);
    this.#btnLogin.render();

    pp = new Panel();
    pp.setClassName(_CFT_LOGIN.CARD_BOTTOM);
    p.pushPanel(pp);
    pp.replaceContent(this.#renderFormRegister());

    // Skip
    if (this._nextView) {
      p.pushSpace(2);
      pp = new Panel();
      p.pushPanel(pp);
      pp.replaceContent(_CFT_LOGIN.SKIP_DIVIDER.replace("__R_OR_GUEST__", R.t("or continue as guest")));
      pp = new Panel();
      pp.setClassName("tw:w-full tw:max-w-sm tw:mx-auto");
      p.pushPanel(pp);
      this.#btnSkip.attachRender(pp);
      this.#btnSkip.render();
      p.pushSpace(1);
    }

    p.pushSpace(2);
  }

  #renderFormFields(): string {
    let s = _CFT_LOGIN.FORM_FIELDS;
    s = s.replace(/__FIELD_CLASS__/g, _CFT_LOGIN.FIELD_CLASS);
    s = s.replace("__R_U_NAME__", R.t("Email") + "/" + R.t("Username"));
    s = s.replace("__R_U_NAME_HINT__", R.t("you@example.com"));
    s = s.replace("__R_PASS__", R.t("Password"));
    s = s.replace("__R_PASS_HINT__", R.t("Your password"));
    s = s.replace("__R_SHOW_PASS__", R.t("Show"));
    s = s.replace("__R_FORGET_PASS__", R.get("FORGET_PASS"));
    return s;
  }

  #renderFormRegister(): string {
    let s = _CFT_LOGIN.FORM_REGISTER;
    s = s.replace("__R_REGISTER__", R.t("Register"));
    s = s.replace("__R_NO_ACCOUNT__", R.get("NO_ACCOUNT") + "?");
    return s;
  }

  #onTogglePasswordVisibility(): void {
    let input = this.#getPasswordInputElement();
    let link = document.getElementById("login-toggle-password");
    if (!link) {
      return;
    }
    let showLabel = R.t("Show");
    let hideLabel = R.t("Hide");
    if (input.type === "password") {
      input.type = "text";
      link.textContent = hideLabel;
    } else {
      input.type = "password";
      link.textContent = showLabel;
    }
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
    this.onFragmentRequestShowView(this, v, "Register");
  }

  #onRetrievePassword(): void {
    let v = new View();
    v.setContentFragment(new FvcRetrievePassword());
    this.onFragmentRequestShowView(this, v, "Retrieve password");
  }

  #onSkip(): void { this.#onActionFinished(); }

  #onActionFinished(): void {
    // Login skipped
    if (this._nextView) {
      this._requestReplaceView(this._nextView, "Next");
    } else {
      this._requestPopView();
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
