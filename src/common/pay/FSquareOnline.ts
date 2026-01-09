import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { T_DATA } from '../plt/Events.js';
import { Env } from '../plt/Env.js';

const _CFT_SQUARE_PAYMENT = {
  MAIN : `<div id="__ID__"><div>`,
};

interface SquarePayments {
  card(): Promise<SquareCard>;
}

interface SquareCard {
  attach(selector: string): Promise<void>;
  tokenize(): Promise<{ status: string; token?: string }>;
}

declare global {
  interface Window {
    Square?: {
      payments(appId: string, locationId: string): SquarePayments;
    };
  }
}

export class FSquareOnline extends Fragment {
  private _fPayBtn: Button;
  private _locationId: string;
  private _payments: SquarePayments | null = null;
  private _card: SquareCard | null = null;

  constructor() {
    super();
    this._fPayBtn = new Button();
    this._fPayBtn.setName("Submit");
    this._fPayBtn.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this._fPayBtn.setDelegate(this);

    this.setChild("pay", this._fPayBtn);

    this._locationId = "LMDBKGWVSN0BH";
    this._payments = null;
    this._card = null;
  }

  onSimpleButtonClicked(_fBar: Button): void { this.#onPayClicked(); }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.ADDON_SCRIPT:
      if (data == Env.SCRIPT.PAYMENT.id) {
        this.#loadJsPayment();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new Panel();
    p.pushPanel(pp);
    let s = _CFT_SQUARE_PAYMENT.MAIN;
    s = s.replace("__ID__", this.#getPaymentElementId());
    pp.replaceContent(s);

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fPayBtn.attachRender(pp);
    this._fPayBtn.disable();
    this._fPayBtn.render();

    if (this._payments) {
      this.#initCard();
    } else {
      this.#loadJsPayment();
    }
  }

  #getPaymentElementId(): string { return "ID_" + this._id + "_PAY"; }

  #loadJsPayment(): void {
    if (Env.isScriptLoaded(Env.SCRIPT.PAYMENT.id) && window.Square) {
      this._payments = window.Square.payments(
          "sandbox-sq0idb-DXWW7Opo8N9NkM1ru0XgDw", this._locationId);
      this.#initCard();
    }
  }

  #initCard(): void {
    if (!this._payments) return;
    this._payments.card()
        .then(v => this.#onCard(v), reason => { console.log(reason); })
        .catch(err => console.log(err));
  }

  #onCard(card: SquareCard): void {
    this._card = card;
    this.#attachPayment();
  }

  #attachPayment(): void {
    if (!this._card) return;
    this._card.attach("#" + this.#getPaymentElementId())
        .then()
        .catch(err => this.#onSquareError(err));
    this._fPayBtn.enable();
  }

  #onPayClicked(): void {
    if (!this._card) return;
    this._fPayBtn.disable();
    this._card.tokenize()
        .then(v => this.#onTokenResult(v))
        .catch(err => this.#onSquareError(err));
  }

  #onSquareError(err: unknown): void {
    console.log(err);
    this._fPayBtn.enable();
  }

  #onTokenResult(r: { status: string; token?: string }): void {
    if (r.status === "OK" && r.token) {
      // @ts-expect-error - delegate may have this method
      this._delegate?.onSquareOnlinePayFragmentRequestPay?.(this, this._locationId, r.token);
    } else {
      this._fPayBtn.enable();
    }
  }
}

export default FSquareOnline;
