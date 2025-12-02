(function(pay) {
const _CFT_BRAINTREE = {
  MAIN : `<div id="__ID__"></div>`,
};

class FBraintree extends ui.Fragment {
  #fBtnPay;
  #braintree;
  #nonce;

  constructor() {
    super();
    this.#fBtnPay = new ui.Button();
    this.#fBtnPay.setName("Next");
    this.#fBtnPay.setValue("NEXT");
    this.#fBtnPay.setLayoutType(ui.Button.LAYOUT_TYPE.BAR);
    this.#fBtnPay.setDelegate(this);

    this.setChild("pay", this.#fBtnPay);
  }

  onSimpleButtonClicked(fBar) { this.#onPayClicked(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.ADDON_SCRIPT:
      if (data == glb.env.SCRIPT.BRAINTREE.id) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let pMain = new ui.ListPanel();
    render.wrapPanel(pMain);

    let pp = new ui.Panel();
    pMain.pushPanel(pp);
    let s = _CFT_BRAINTREE.MAIN;
    s = s.replace("__ID__", this.#getPaymentElementId());
    pp.replaceContent(s);

    pp = new ui.PanelWrapper();
    pMain.pushPanel(pp);
    this.#fBtnPay.attachRender(pp);
    this.#fBtnPay.disable();
    this.#fBtnPay.render();

    if (this.#braintree) {
      this.#fBtnPay.enable();
    } else {
      this.#loadJsPayment();
    }
  }

  #getPaymentElementId() { return "ID_" + this._id + "_PAY"; }

  #loadJsPayment() {
    if (glb.env.isScriptLoaded(glb.env.SCRIPT.BRAINTREE.id)) {
      this.#asInit()
          .then(obj => this.#onCreateSuccess(obj))
          .catch(e => this.#onCreateError(e));
    }
  }

  async #asInit() {
    let r = await plt.Api.asyncFragmentCall(this, "api/braintree/client_token");
    return await window.braintree.dropin.create({
      authorization : r.token,
      container : "#" + this.#getPaymentElementId()
    });
  }

  #onCreateSuccess(obj) {
    this.#braintree = obj;
    this.#fBtnPay.enable();
  }

  #onCreateError(e) { console.error("Failed to create braintree", e); }

  #onPayClicked() {
    this.#fBtnPay.disable();
    if (this.#fBtnPay.getValue() == "NEXT") {
      this.#asNext()
          .then(() => this.#onNextSuccess())
          .catch(e => this.#onNextError(e));
    } else {
      this.#asSubmit()
          .then(() => this.#onPaySuccess())
          .catch(e => this.#onPayError(e));
    }
  }

  async #asNext() {
    let r = await this.#braintree.requestPaymentMethod();
    console.log(r);
    this.#nonce = r.nonce;
    this.#fBtnPay.setName("Submit");
    this.#fBtnPay.setValue("SUBMIT");
    this.#fBtnPay.render();
    this.#fBtnPay.enable();
  }

  async #asSubmit() {
    let r = await plt.Api.asyncFragmentJsonPost(
        this, "api/braintree/deposit", {nonce : this.#nonce, device_data : ""});
  }

  #onNextSuccess() { console.log("Next success"); }

  #onNextError() {
    console.error("Failed to pay through braintree", e);
    this.#fBtnPay.enable();
  }

  #onPaySuccess() { console.log("Payment success"); }

  #onPayError(e) {
    console.error("Failed to pay through braintree", e);
    this.#fBtnPay.enable();
  }
};

pay.FBraintree = FBraintree;
}(window.pay = window.pay || {}));
