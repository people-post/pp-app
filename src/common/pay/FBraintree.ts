import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { T_DATA } from '../plt/Events.js';
import { Env } from '../plt/Env.js';
import { Api } from '../plt/Api.js';

const _CFT_BRAINTREE = {
  MAIN : `<div id="__ID__"></div>`,
};

interface BraintreeInstance {
  requestPaymentMethod(): Promise<{ nonce: string; deviceData?: string }>;
  teardown(): void;
  clearSelectedPaymentMethod(): void;
}

declare global {
  interface Window {
    braintree?: {
      dropin: {
        create(options: { authorization: string; container: string }): Promise<BraintreeInstance>;
      };
    };
  }
}

export class FBraintree extends Fragment {
  #fBtnPay: Button;
  #braintree: BraintreeInstance | null = null;
  #payload: { nonce: string; deviceData?: string } | null = null;
  #amount = 0;
  #userId: string | null = null;
  #userPublicKey: string | null = null;

  constructor() {
    super();
    this.#fBtnPay = new Button();
    this.#fBtnPay.setName("Submit");
    this.#fBtnPay.setValue("SUBMIT");
    this.#fBtnPay.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#fBtnPay.setDelegate(this);

    this.setChild("btnpay", this.#fBtnPay);
  }

  setAmount(amount: number): void { this.#amount = amount; }
  setUserId(userId: string | null): void { this.#userId = userId; }
  setUserPublicKey(key: string | null): void { this.#userPublicKey = key; }

  onSimpleButtonClicked(_fBar: Button): void { this.#onPayClicked(); }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.ADDON_SCRIPT:
      if (data == Env.SCRIPT.BRAINTREE.id) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
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

  #getPaymentElementId(): string { return "ID_" + this._id + "_PAY"; }

  #loadJsPayment(): void {
    if (Env.isScriptLoaded(Env.SCRIPT.BRAINTREE.id)) {
      this.#asInit()
          .then(obj => this.#onCreateSuccess(obj))
          .catch(e => this.#onCreateError(e));
    }
  }

  async #asInit(): Promise<BraintreeInstance> {
    let r = await Api.asFragmentCall(this, "api/token/braintree_client") as { token: string };
    if (!window.braintree) {
      throw new Error("Braintree SDK not loaded");
    }
    return await window.braintree.dropin.create({
      authorization : r.token,
      container : "#" + this.#getPaymentElementId()
    });
  }

  #onCreateSuccess(obj: BraintreeInstance): void {
    this.#braintree = obj;
    this.#fBtnPay.enable();
  }

  #onCreateError(e: unknown): void { console.error("Failed to create braintree", e); }

  #onPayClicked(): void {
    this.#asSubmit()
        .then(() => this.#onPaySuccess())
        .catch(e => this.#onPayError(e));
  }

  async #asSubmit(): Promise<void> {
    // Validate values;
    if (!(this.#amount > 0 && this.#userId && this.#userPublicKey)) {
      return;
    }

    if (!this.#braintree) {
      return;
    }

    this.#payload = await this.#braintree.requestPaymentMethod();
    console.log("Payload:", this.#payload);

    let r = await Api.asFragmentJsonPost(
        this, "api/charity/braintree_donate", {
          amount : this.#amount,
          nonce : this.#payload.nonce,
          device_data : this.#payload.deviceData,
          user_id : this.#userId,
          user_public_key : this.#userPublicKey
        });
    console.log(r);
  }

  #onPaySuccess(): void {
    console.log("Payment success");
    if (this.#braintree) {
      this.#braintree.teardown();
    }
    // @ts-expect-error - delegate may have this method
    this._delegate?.onBraintreePaymentSuccess?.(this);
  }

  #onPayError(e: unknown): void {
    console.error("Failed to pay through braintree", e);
    if (this.#braintree) {
      this.#braintree.clearSelectedPaymentMethod();
    }
  }
}

export default FBraintree;
