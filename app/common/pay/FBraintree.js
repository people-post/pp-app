(function(pay) {
const _CFT_BRAINTREE = {
  MAIN : `<div id="__ID__"></div>`,
};

class FBraintree extends ui.Fragment {
  #fBtnPay;
  #braintree;
  #payload;
  #amount = 0;
  #userId;
  #userPublicKey;

  constructor() {
    super();
    this.#fBtnPay = new ui.Button();
    this.#fBtnPay.setName("Submit");
    this.#fBtnPay.setValue("SUBMIT");
    this.#fBtnPay.setLayoutType(ui.Button.LAYOUT_TYPE.BAR);
    this.#fBtnPay.setDelegate(this);

    this.setChild("btnpay", this.#fBtnPay);
  }

  setAmount(amount) { this.#amount = amount; }
  setUserId(userId) { this.#userId = userId; }
  setUserPublicKey(key) { this.#userPublicKey = key; }

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

    pMain.pushSpace(1);

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
    let r = await plt.Api.asyncFragmentCall(this, "api/token/braintree_client");
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
    this.#asSubmit()
        .then(() => this.#onPaySuccess())
        .catch(e => this.#onPayError(e));
  }

  async #asSubmit() {
    // Validate values;
    if (!(this.#amount > 0 && this.#userId && this.#userPublicKey)) {
      return;
    }

    this.#payload = await this.#braintree.requestPaymentMethod();
    console.log("Payload:", this.#payload);

    let r = await plt.Api.asyncFragmentJsonPost(
        this, "api/charity/braintree_donate", {
          amount : this.#amount,
          nonce : this.#payload.nonce,
          device_data : this.#payload.deviceData,
          user_id : this.#userId,
          user_public_key : this.#userPublicKey
        });
    console.log(r);
  }

  #onPaySuccess() {
    console.log("Payment success");
    this.#braintree.teardown();
    this._delegate.onBraintreePaymentSuccess(this);
  }

  #onPayError(e) {
    console.error("Failed to pay through braintree", e);
    this.#braintree.clearSelectedPaymentMethod();
  }
};

pay.FBraintree = FBraintree;
}(window.pay = window.pay || {}));
