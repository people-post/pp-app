(function(ftpg) {
class FvcBriefDonation extends ui.FViewContentBase {
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
    this.#fPayment.attachRender(render);
    this.#fPayment.render();
  }
};

ftpg.FvcBriefDonation = FvcBriefDonation;
}(window.ftpg = window.ftpg || {}));
