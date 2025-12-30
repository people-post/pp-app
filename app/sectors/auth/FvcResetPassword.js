export const CF_RESET_PASSWORD = {
  SUBMIT : Symbol(),
};

const _CFT_RESET_PASSWORD = {
  MAIN : `
    <br>
    <div class="center-align">Reset password</div>
    <br>
    <table  class="automargin">
    <tbody> 
      <tr>
        <td><label class="s-font5" for="ID_PASSWORD">New Password:</label></td>
      </tr>
      <tr>
        <td><input id="ID_PASSWORD" type="password" placeholder="New Password"></td>
      </tr>
      <tr>
        <td><label class="s-font5" for="ID_PASSWORD_2">Confirm New Password:</label></td>
      </tr>
      <tr>
        <td><input id="ID_PASSWORD_2" type="password" placeholder="Confirm password"></td>
      </tr>
    </tbody>
  </table>
  <br>
  <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(auth.CF_RESET_PASSWORD.SUBMIT)">Submit</a>`,
}

export class FvcResetPassword extends ui.FScrollViewContent {
  constructor() {
    super();
    this._resetCode = null;
  }

  initFromUrl(urlParam) { this._resetCode = urlParam.get(C.URL_PARAM.CODE); }

  action(type, ...args) {
    switch (type) {
    case CF_RESET_PASSWORD.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    render.replaceContent(_CFT_RESET_PASSWORD.MAIN);
  }

  #onSubmit() {
    if (!this.#validateInputs()) {
      return;
    }
    let password = document.getElementById("ID_PASSWORD").value;
    let url = "api/auth/reset_password";
    let fd = new FormData();
    fd.append("password", password);
    fd.append("code", this._resetCode);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onResetPasswordRRR(d));
  }

  #validateInputs() {
    let password = document.getElementById("ID_PASSWORD").value;
    let password2 = document.getElementById("ID_PASSWORD_2").value;
    if (password != password2) {
      this._owner.onLocalErrorInFragment(this, R.get("EL_PASSWORD_MISMATCH"));
      return false;
    }
    return true;
  }

  #onResetSuccess() {
    let v = new ui.View();
    let f = new ui.FvcNotice();
    f.setMessage(R.get("RESET_PASSWORD_SUCCESS"));
    f.setCloseAction(() => window.close());
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v,
                                                    "Reset password success");
  }

  #onResetPasswordRRR(data) { this.#onResetSuccess();   }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.auth = window.auth || {};
  window.auth.CF_RESET_PASSWORD = CF_RESET_PASSWORD;
  window.auth.FvcResetPassword = FvcResetPassword;
}