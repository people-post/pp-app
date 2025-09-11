(function(auth) {
const _CFT_ACCOUNT_ACTIVATION = {
  MAIN : `
    <br>
    <div class="center-align">Activating your account...</div>`,
};

class FvcAccountActivation extends ui.FScrollViewContent {
  constructor() {
    super();
    this._activationCode = null;
    this._isActivating = false;
  }

  initFromUrl(urlParam) {
    this._activationCode = urlParam.get(C.URL_PARAM.CODE);
    if (!this._isActivating) {
      this.#asyncActivateAccount(this._activationCode);
    }
  }

  _renderContentOnRender(render) {
    render.replaceContent(_CFT_ACCOUNT_ACTIVATION.MAIN);
  }

  #onActivationSuccess() {
    let v = new ui.View();
    let f = new ui.FvcNotice();
    f.setMessage(R.get("ACK_ACCOUNT_ACTIVATION"));
    f.setCloseAction(() => window.close());
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v,
                                                    "Activate success");
  }

  #asyncActivateAccount(activationCode) {
    this._isActivating = true;
    let url = "/api/auth/activate";
    let fd = new FormData();
    fd.append("code", activationCode);
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onActivateRRR(d));
  }

  #onActivateRRR(data) {
    this.#onActivationSuccess();
    this._isActivating = false;
  }
};

auth.FvcAccountActivation = FvcAccountActivation;
}(window.auth = window.auth || {}));
