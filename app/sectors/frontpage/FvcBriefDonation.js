(function(ftpg) {
class FvcBriefDonation extends ui.FViewContentBase {
  #fPayment;

  constructor() {
    super();
    this.#fPayment = new pay.FBraintree();
    this.setChild("pay", this.#fPayment);
  }

  _renderOnRender(render) {
    this.#fPayment.attachRender(render);
    this.#fPayment.render();
  }
};

ftpg.FvcBriefDonation = FvcBriefDonation;
}(window.ftpg = window.ftpg || {}));
