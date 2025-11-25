(function(pay) {
const _CFT_BRAINTREE = {
  MAIN : `<div id="__ID__"><div>`,
};

class FBraintree extends ui.Fragment {
  #fBtnPay;
  #braintree;

  constructor() {
    super();
    this.#fBtnPay = new ui.Button();
    this.#fBtnPay.setName("Submit");
    this.#fBtnPay.setLayoutType(ui.Button.LAYOUT_TYPE.BAR);
    this.#fBtnPay.setDelegate(this);

    this.setChild("pay", this.#fBtnPay);
  }

  onSimpleButtonClicked(fBar) { this.#onPayClicked(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.ADDON_SCRIPT:
      if (data == glb.env.SCRIPT.BRAINTREE.id) {
        this.#loadJsPayment();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let pp = new ui.Panel();
    p.pushPanel(pp);
    let s = _CFT_BRAINTREE.MAIN;
    s = s.replace("__ID__", this.#getPaymentElementId());
    pp.replaceContent(s);

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
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
      window.braintree.dropin
          .create(
              {authorization : "test", container : this.#getPaymentElementId()})
          .then(obj => this.#onCreateSuccess(obj))
          .catch(e => this.#onCreateError(e));
    }
  }

  #onCreateSuccess(obj) {
    this.#braintree = obj;
    this.#fBtnPay.enable();
  }

  #onCreateError(e) { console.error("Failed to create braintree", e); }

  #onPayClicked() { this.#fBtnPay.disable(); }
};

pay.FBraintree = FBraintree;
}(window.pay = window.pay || {}));
