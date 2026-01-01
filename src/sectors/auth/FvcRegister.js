import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcNotice } from '../../lib/ui/controllers/views/FvcNotice.js';
import { api } from '../../common/plt/Api.js';

export const CF_REGISTER_CONTENT = {
  VALIDATE_EMAIL : "CF_REGISTER_CONTENT_1",
  SHOW_TERM : "CF_REGISTER_CONTENT_2",
  ON_TOGGLE_AGREE : "CF_REGISTER_CONTENT_3",
}

const _CFT_REGISTER_CONTENT = {
  MAIN : `<table class="automargin">
    <tbody> 
      <tr>
        <td><label class="s-font5" for="ID_EMAIL">__R_EMAIL__:</label></td>
      </tr>
      <tr>
        <td>
          <input id="ID_EMAIL" type="text" onchange="G.action(CF_REGISTER_CONTENT.VALIDATE_EMAIL)" placeholder="__R_EMAIL_HINT__">
        </td>
      </tr>
      <tr>
        <td><label class="s-font5" for="ID_PASSWORD">__R_PASS__:</label></td>
      </tr>
      <tr>
        <td><input id="ID_PASSWORD" type="password" autocomplete="new-password" placeholder="__R_PASS_HINT__"></td>
      </tr>
      <tr>
        <td><label class="s-font5" for="ID_PASSWORD_2">__R_CONFIRM_PASS__:</label></td>
      </tr>
      <tr>
        <td><input id="ID_PASSWORD_2" type="password" autocomplete="new-password" placeholder="__R_CONFIRM_PASS_HINT__"></td>
      </tr>
    </tbody>
  </table>`,
  TERM :
      `<input type="checkbox" onchange="javascript:G.action(CF_REGISTER_CONTENT.ON_TOGGLE_AGREE, this.checked)">__R_AGREE__ __TERM__.`,
}

export class FvcRegister extends FScrollViewContent {
  constructor() {
    super();
    this._fSubmit = new Button();
    this._fSubmit.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this._fSubmit.disable();
    this._fSubmit.setName(R.t("Register"));
    this._fSubmit.setDelegate(this);
    this.setChild("submit", this._fSubmit);
  }

  getActionButton() {
    // Return empty fragment to avoid being assigned with default action button
    return new Fragment();
  }

  onSimpleButtonClicked(fButton) { this.#onSubmit(); }

  action(type, ...args) {
    switch (type) {
    case CF_REGISTER_CONTENT.VALIDATE_EMAIL:
      this.#asyncValidateEmail();
      break;
    case CF_REGISTER_CONTENT.ON_TOGGLE_AGREE:
      this.#onToggleAgree(args[0]);
      break;
    case CF_REGISTER_CONTENT.SHOW_TERM:
      this._displayMessage(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    p.pushSpace(1);

    let pp = new Panel();
    pp.setClassName("center-align");
    p.pushPanel(pp);
    pp.replaceContent(R.t("Join us"));
    p.pushSpace(1);

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderForm());

    p.pushSpace(1);

    pp = new Panel();
    pp.setClassName("s-font7 center-align");
    p.pushPanel(pp);
    pp.replaceContent(this.#renderTerms());

    p.pushSpace(1);

    pp = new Panel();
    p.pushPanel(pp);

    this._fSubmit.attachRender(pp);
    this._fSubmit.render();
  }

  #renderForm() {
    let s = _CFT_REGISTER_CONTENT.MAIN;
    s = s.replace("__R_EMAIL__", R.t("Email address"));
    s = s.replace("__R_EMAIL_HINT__", R.t("Email address"));
    s = s.replace("__R_PASS__", R.t("Password"));
    s = s.replace("__R_PASS_HINT__", R.t("Password"));
    s = s.replace("__R_CONFIRM_PASS__", R.t("Confirm password"));
    s = s.replace("__R_CONFIRM_PASS_HINT__", R.t("Confirm password"));
    return s;
  }

  #renderTerms() {
    let s = _CFT_REGISTER_CONTENT.TERM;
    s = s.replace("__TERM__",
                  this._renderTipLink("CF_REGISTER_CONTENT.SHOW_TERM",
                                      R.t("Terms and Conditions"),
                                      "TERM_REGISTER"));
    s = s.replace("__R_AGREE__", R.t("Read and agree to our"));
    return s;
  }

  #onToggleAgree(b) {
    if (b) {
      this._fSubmit.enable();
    } else {
      this._fSubmit.disable();
    }
  }

  #onSubmit() {
    if (!this.#validateInputs()) {
      return;
    }
    let email = document.getElementById("ID_EMAIL").value;
    let password = document.getElementById("ID_PASSWORD").value;

    dba.Auth.asyncRegisterUser(email, password,
                               () => this.#onRegisterSuccess());
  }

  #onRegisterSuccess() {
    let v = new View();
    let f = new FvcNotice();
    f.setMessage(R.get("REGISTER_SUCCESS"));
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Register success");
  }

  #validateInputs() {
    let email = document.getElementById("ID_EMAIL").value;
    let password = document.getElementById("ID_PASSWORD").value;
    let password2 = document.getElementById("ID_PASSWORD_2").value;
    if (password != password2) {
      this.onLocalErrorInFragment(this, R.get("EL_PASSWORD_MISMATCH"));
      return false;
    }
    return true;
  }

  #asyncValidateEmail() {
    let email = document.getElementById("ID_EMAIL").value;
    let url = "/api/auth/test_email?email=" + encodeURIComponent(email);
    api.asyncFragmentCall(this, url).then(d => this.#onValidateEmailRRR(d));
  }

  #onValidateEmailRRR(data) {  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.CF_REGISTER_CONTENT = CF_REGISTER_CONTENT;
  window.auth = window.auth || {};
  window.auth.FvcRegister = FvcRegister;
}
