
export class FvcBriefDonation extends ui.FViewContentBase {
  #fPayment;

  constructor() {
    super();
    this.#fPayment = new pay.FBraintree();
    this.#fPayment.setDelegate(this);
    this.setChild("pay", this.#fPayment);
  }

  onBraintreePaymentSuccess(fBraintree) {
    let v = new ui.View();
    let f = new ftpg.FvcBriefDonationResult();
    f.setType(ftpg.FvcBriefDonationResult.T_TYPE.SUCCESS);
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v, "Donation Result");
  }

  _renderOnRender(render) {
    let pList = new ui.ListPanel();
    render.wrapPanel(pList);

    let p = new ui.PanelWrapper();
    pList.pushPanel(p);
    p.replaceContent("TODO: Donate choices");

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    // TODO:
    this.#fPayment.setAmount(10);
    this.#fPayment.setUserId("test_user_id");
    this.#fPayment.setUserPublicKey("test_public_key");

    this.#fPayment.attachRender(p);
    this.#fPayment.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.ftpg = window.ftpg || {};
  window.ftpg.FvcBriefDonation = FvcBriefDonation;
}
