(function(auth) {
const _CFT_RETRIEVE_PASSWORD = {
  MAIN : `<table class="automargin">
    <tbody> 
      <tr>
        <td><label class="s-font5" for="email">__R_YOUR_EMAIL__:</label></td>
      </tr>
      <tr>
        <td>
          <input id="email" type="text" placeholder="__R_EMAIL__">
          <span></span>
        </td>
      </tr>
    </tbody>
  </table>`,
  SUCCESS_MSG : `<div>__R_SUCCESS__!</div>
    <div>__R_RESET_SUCCESS__</div>
    <div>__R_THANK_YOU__!</div>`,
}

class FvcRetrievePassword extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fSubmit = new ui.Button();
    this._fSubmit.setName(R.t("Send reset link"));
    this._fSubmit.setValue("SUBMIT");
    this._fSubmit.setDelegate(this);
    this.setChild("submit", this._fSubmit);
  }

  getActionButton() {
    // Return empty fragment to avoid being assigned with default action button
    return new ui.Fragment();
  }

  onSimpleButtonClicked(fButton) {
    if (fButton.getValue() == "SUBMIT") {
      this.#asyncSubmit();
    }
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    p.pushSpace(1);

    let pp = new ui.Panel();
    pp.setClassName("center-align");
    p.pushPanel(pp);
    pp.replaceContent(R.get("RESET_PASS"));
    p.pushSpace(1);

    pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderForm());

    p.pushSpace(1);

    pp = new ui.Panel();
    p.pushPanel(pp);
    this._fSubmit.attachRender(pp);
    this._fSubmit.render();
  }

  #renderForm() {
    let s = _CFT_RETRIEVE_PASSWORD.MAIN;
    s = s.replace("__R_YOUR_EMAIL__", R.t("Your email address"));
    s = s.replace("__R_EMAIL__", R.t("Email address"));
    return s;
  }

  #renderSuccessMsg() {
    let s = _CFT_RETRIEVE_PASSWORD.SUCCESS_MSG;
    s = s.replace("__R_SUCCESS__", R.t("Success"));
    s = s.replace("__R_RESET_SUCCESS__", R.get("RESET_PASS_SUCCESS"));
    s = s.replace("__R_THANK_YOU__", R.t("Thank you"));
    return s;
  }

  #asyncSubmit() {
    let email = document.getElementById("email").value;
    var url = "api/auth/retrieve_password?email=" + encodeURIComponent(email);
    plt.Api.asyncFragmentCall(this, url).then(
        d => this.#onRetrievePasswordRRR(d));
  }

  #onRetrievePasswordRRR(data) {
    let v = new ui.View();
    let f = new ui.FvcNotice();
    f.setMessage(this.#renderSuccessMsg());
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v, "Message");
  }
};

auth.FvcRetrievePassword = FvcRetrievePassword;
}(window.auth = window.auth || {}));
