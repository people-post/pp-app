import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FvcBriefDonationResult } from './FvcBriefDonationResult.js';
import { FBraintree } from '../../common/pay/FBraintree.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcBriefDonation extends FViewContentBase {
  #fPayment: FBraintree;

  constructor() {
    super();
    this.#fPayment = new FBraintree();
    this.#fPayment.setDelegate(this);
    this.setChild("pay", this.#fPayment);
  }

  onBraintreePaymentSuccess(fBraintree: FBraintree): void {
    let v = new View();
    let f = new FvcBriefDonationResult();
    f.setType(FvcBriefDonationResult.T_TYPE.SUCCESS);
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v, "Donation Result");
  }

  _renderOnRender(render: Render): void {
    let pList = new ListPanel();
    render.wrapPanel(pList);

    let p = new PanelWrapper();
    pList.pushPanel(p);
    p.replaceContent("TODO: Donate choices");

    p = new PanelWrapper();
    pList.pushPanel(p);
    // TODO:
    this.#fPayment.setAmount(10);
    this.#fPayment.setUserId("test_user_id");
    this.#fPayment.setUserPublicKey("test_public_key");

    this.#fPayment.attachRender(p);
    this.#fPayment.render();
  }
};
