import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcNotice } from '../../lib/ui/controllers/views/FvcNotice.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { Api } from '../../common/plt/Api.js';
import { R } from '../../common/constants/R.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

const _CFT_ACCOUNT_ACTIVATION = {
  MAIN : `
    <br>
    <div class="center-align">Activating your account...</div>`,
};

export class FvcAccountActivation extends FScrollViewContent {
  protected _activationCode: string | null;
  protected _isActivating: boolean;

  constructor() {
    super();
    this._activationCode = null;
    this._isActivating = false;
  }

  initFromUrl(urlParam: URLSearchParams): void {
    this._activationCode = urlParam.get(URL_PARAM.CODE);
    if (!this._isActivating) {
      this.#asyncActivateAccount(this._activationCode);
    }
  }

  _renderContentOnRender(render: Render): void {
    render.replaceContent(_CFT_ACCOUNT_ACTIVATION.MAIN);
  }

  #onActivationSuccess(): void {
    let v = new View();
    let f = new FvcNotice();
    f.setMessage(R.get("ACK_ACCOUNT_ACTIVATION"));
    f.setCloseAction(() => window.close());
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v,
                                                    "Activate success");
  }

  #asyncActivateAccount(activationCode: string | null): void {
    if (!activationCode) {
      return;
    }
    this._isActivating = true;
    let url = "/api/auth/activate";
    let fd = new FormData();
    fd.append("code", activationCode);
    Api.asFragmentPost(this, url, fd).then(d => this.#onActivateRRR(d));
  }

  #onActivateRRR(data: unknown): void {
    this.#onActivationSuccess();
    this._isActivating = false;
  }
}
