import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcNotice } from '../../lib/ui/controllers/views/FvcNotice.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { Api } from '../../common/plt/Api.js';

const _CFT_ACCOUNT_ACTIVATION = {
  MAIN : `
    <br>
    <div class="center-align">Activating your account...</div>`,
};

export class FvcAccountActivation extends FScrollViewContent {
  constructor() {
    super();
    this._activationCode = null;
    this._isActivating = false;
  }

  initFromUrl(urlParam) {
    this._activationCode = urlParam.get(URL_PARAM.CODE);
    if (!this._isActivating) {
      this.#asyncActivateAccount(this._activationCode);
    }
  }

  _renderContentOnRender(render) {
    render.replaceContent(_CFT_ACCOUNT_ACTIVATION.MAIN);
  }

  #onActivationSuccess() {
    let v = new View();
    let f = new FvcNotice();
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
    Api.asFragmentPost(this, url, fd).then(d => this.#onActivateRRR(d));
  }

  #onActivateRRR(data) {
    this.#onActivationSuccess();
    this._isActivating = false;
  }
}
