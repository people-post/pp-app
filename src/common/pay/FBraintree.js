import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { T_DATA } from '../plt/Events.js';

const _CFT_BRAINTREE = {
  MAIN : `<div id="__ID__"></div>`,
};

export class FBraintree extends Fragment {
  #fBtnPay;
  #braintree;
  #payload;
  #amount = 0;
  #userId;
  #userPublicKey;

  constructor() {
    super();
    this.#fBtnPay = new Button();
    this.#fBtnPay.setName("Submit");
    this.#fBtnPay.setValue("SUBMIT");
    this.#fBtnPay.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#fBtnPay.setDelegate(this);

    this.setChild("btnpay", this.#fBtnPay);
  }

  setAmount(amount) { this.#amount = amount; }
  setUserId(userId) { this.#userId = userId; }
  setUserPublicKey(key) { this.#userPublicKey = key; }

  onSimpleButtonClicked(fBar) { this.#onPayClicked(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.ADDON_SCRIPT:
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
    let pMain = new ListPanel();
    render.wrapPanel(pMain);

    let pp = new Panel();
    pMain.pushPanel(pp);
    let s = _CFT_BRAINTREE.MAIN;
    s = s.replace("__ID__", this.#getPaymentElementId());
    pp.replaceContent(s);

    pMain.pushSpace(1);

    pp = new PanelWrapper();
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
    let r = await glb.api.asFragmentCall(this, "api/token/braintree_client");
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

    let r = await glb.api.asFragmentJsonPost(
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
