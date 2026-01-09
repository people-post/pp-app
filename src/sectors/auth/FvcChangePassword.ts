// Note: ui namespace is available globally, but we could add explicit imports if needed
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcNotice } from '../../lib/ui/controllers/views/FvcNotice.js';
import { Api } from '../../common/plt/Api.js';
import { R } from '../../common/constants/R.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export const CF_CHANGE_PASSWORD = {
  SUBMIT : Symbol(),
};

const _CFT_CHANGE_PASSWORD = {
  MAIN : `
    <br>
    <div class="center-align">Change password</div>
    <br>
    <table  class="automargin">
    <tbody> 
      <tr>
        <td><label class="s-font5" for="ID_PASSWORD_OLD">Password:</label></td>
      </tr>
      <tr>
        <td><input id="ID_PASSWORD_OLD" type="password" placeholder="Password"></td>
      </tr>
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
  <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(auth.CF_CHANGE_PASSWORD.SUBMIT)">Submit</a>`,
};

export class FvcChangePassword extends FScrollViewContent {
  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_CHANGE_PASSWORD.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    render.replaceContent(_CFT_CHANGE_PASSWORD.MAIN);
  }

  #onSubmit(): void {
    if (!this.#validateInputs()) {
      return;
    }
    let password = (document.getElementById("ID_PASSWORD_OLD") as HTMLInputElement).value;
    let password_new = (document.getElementById("ID_PASSWORD") as HTMLInputElement).value;
    let url = "api/auth/change_password";
    let fd = new FormData();
    fd.append("password", password);
    fd.append("new_password", password_new);
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onChangePasswordRRR(d));
  }

  #validateInputs(): boolean {
    let password = (document.getElementById("ID_PASSWORD") as HTMLInputElement).value;
    let password2 = (document.getElementById("ID_PASSWORD_2") as HTMLInputElement).value;
    if (password != password2) {
      this.onLocalErrorInFragment(this, R.get("EL_PASSWORD_MISMATCH"));
      return false;
    }
    password2 = (document.getElementById("ID_PASSWORD_OLD") as HTMLInputElement).value;
    if (password == password2) {
      this.onLocalErrorInFragment(this, R.get("EL_NEW_PASSWORD_SAME"));
      return false;
    }
    return true;
  }

  #onChangeSuccess(): void {
    let v = new View();
    let f = new FvcNotice();
    f.setMessage(R.get("CHANGE_PASSWORD_SUCCESS"));
    f.setCloseAction(() => window.close());
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v,
                                                    "Change password success");
  }

  #onChangePasswordRRR(data: unknown): void { this.#onChangeSuccess();   }
}
