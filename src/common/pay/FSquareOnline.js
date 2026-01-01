import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { T_DATA } from '../plt/Events.js';

const _CFT_SQUARE_PAYMENT = {
  MAIN : `<div id="__ID__"><div>`,
};

export class FSquareOnline extends Fragment {
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

  onSimpleButtonClicked(fBar) { this.#onPayClicked(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.ADDON_SCRIPT:
      if (data == glb.env.SCRIPT.PAYMENT.id) {
        this.#loadJsPayment();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
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

  #getPaymentElementId() { return "ID_" + this._id + "_PAY"; }

  #loadJsPayment() {
    if (glb.env.isScriptLoaded(glb.env.SCRIPT.PAYMENT.id)) {
      this._payments = window.Square.payments(
          "sandbox-sq0idb-DXWW7Opo8N9NkM1ru0XgDw", this._locationId);
      this.#initCard();
    }
  }

  #initCard() {
    this._payments.card()
        .then(v => this.#onCard(v), reason => { console.log(reason); })
        .catch(err => console.log(err));
  }

  #onCard(card) {
    this._card = card;
    this.#attachPayment();
  }

  #attachPayment() {
    this._card.attach("#" + this.#getPaymentElementId())
        .then()
        .catch(err => this.#onSquareError(err));
    this._fPayBtn.enable();
  }

  #onPayClicked() {
    this._fPayBtn.disable();
    this._card.tokenize()
        .then(v => this.#onTokenResult(v))
        .catch(err => this.#onSquareError(err));
  }

  #onSquareError(err) {
    console.log(err);
    this._fPayBtn.enable();
  }

  #onTokenResult(r) {
    if (r.status === "OK") {
      this._delegate.onSquareOnlinePayFragmentRequestPay(this, this._locationId,
                                                       r.token);
    } else {
      this._fPayBtn.enable();
    }
  }
};
