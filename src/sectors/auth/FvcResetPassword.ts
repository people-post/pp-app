import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcNotice } from '../../lib/ui/controllers/views/FvcNotice.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { Api } from '../../common/plt/Api.js';
import { R } from '../../common/constants/R.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

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
};

export class FvcResetPassword extends FScrollViewContent {
  protected _resetCode: string | null;

  constructor() {
    super();
    this._resetCode = null;
  }

  initFromUrl(urlParam: URLSearchParams): void { this._resetCode = urlParam.get(URL_PARAM.CODE); }

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_RESET_PASSWORD.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    render.replaceContent(_CFT_RESET_PASSWORD.MAIN);
  }

  #onSubmit(): void {
    if (!this.#validateInputs()) {
      return;
    }
    let password = (document.getElementById("ID_PASSWORD") as HTMLInputElement).value;
    let url = "api/auth/reset_password";
    let fd = new FormData();
    fd.append("password", password);
    if (this._resetCode) {
      fd.append("code", this._resetCode);
    }
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onResetPasswordRRR(d));
  }

  #validateInputs(): boolean {
    let password = (document.getElementById("ID_PASSWORD") as HTMLInputElement).value;
    let password2 = (document.getElementById("ID_PASSWORD_2") as HTMLInputElement).value;
    if (password != password2) {
      this._owner.onLocalErrorInFragment(this, R.get("EL_PASSWORD_MISMATCH"));
      return false;
    }
    return true;
  }

  #onResetSuccess(): void {
    let v = new View();
    let f = new FvcNotice();
    f.setMessage(R.get("RESET_PASSWORD_SUCCESS"));
    f.setCloseAction(() => window.close());
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v,
                                                    "Reset password success");
  }

  #onResetPasswordRRR(data: unknown): void { this.#onResetSuccess();   }
}
