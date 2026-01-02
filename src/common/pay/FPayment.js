import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FoldableItemFragment } from '../gui/FoldableItemFragment.js';
import { FSquareOnline } from './FSquareOnline.js';
import { FBraintree } from './FBraintree.js';
import { FPaymentTerminalList } from './FPaymentTerminalList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SimpleText } from '../../lib/ui/controllers/fragments/SimpleText.js';
import { T_DATA } from '../plt/Events.js';
import { Exchange } from '../dba/Exchange.js';
import { Account } from '../dba/Account.js';
import { Cart } from '../dba/Cart.js';

const _CFT_PAYMENT = {
  TITLE : `<div class="payment-choice-title">__TEXT__</div>`,
}

export class FPayment extends Fragment {
  #fSquare;
  #fBraintree;

  constructor() {
    super();
    this._fAsset = new FoldableItemFragment();
    this._fAsset.setHeaderFragment(this.#createTitleFragment("Pay by balance"));
    this._fAsset.setDelegate(this);
    this.setChild("asset", this._fAsset);

    this.#fSquare = new FoldableItemFragment();
    this.#fSquare.setHeaderFragment(this.#createTitleFragment("Pay by card"));
    let f = new FSquareOnline();
    f.setDelegate(this);
    this.#fSquare.setContentFragment(f);
    this.#fSquare.setDelegate(this);
    this.setChild("square", this.#fSquare);

    this.#fBraintree = new FBraintree();
    this.setChild("braintree", this.#fBraintree);

    // For offline checkout
    this._fTerminals = new FPaymentTerminalList();
    this._fTerminals.setDelegate(this);
    this.setChild("terminals", this._fTerminals);

    this._fSelected = null;
  }

  setRegisterId(id) { this._fTerminals.setRegisterId(id); }

  onFoldableItemOpen(fItem, itemId) {
    if (this._fSelected) {
      this._fSelected.close();
    }
    this._fSelected = fItem;
  }
  onFoldableItemClose(fItem, itemId) { this._fSelected = null; }

  onSquareOnlinePayFragmentRequestPay(fSquare, locationId, sourceId) {
    let order = this._dataSource.getOrderForCartPaymentFragment(this);
    this.#asyncSubmitSquareOnlinePay(locationId, sourceId, order.getId());
  }
  onPaymentTerminalSelectedInPaymentTerminalListFragment(fTerminalList,
                                                         terminalId) {
    this.#asyncSubmitTerminalPay(terminalId);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.ASSET:
      this.render();
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let order = this._dataSource.getOrderForCartPaymentFragment(this);
    let nAsset = Exchange.getAsset(order.getCurrencyId());
    if (nAsset && nAsset >= order.getTotal()) {
      let pp = new PanelWrapper();
      p.pushPanel(pp);

      this._fAsset.setIsOpen(this._fSelected == this._fAsset);
      this._fAsset.attachRender(pp);
      this._fAsset.render();
    }

    let pp = new PanelWrapper();
    p.pushPanel(pp);

    this.#fSquare.setIsOpen(this._fSelected == this.#fSquare);
    this.#fSquare.attachRender(pp);
    this.#fSquare.render();

    /*
  pp = new PanelWrapper();
  p.pushPanel(pp);
  this.#fBraintree.attachRender(pp);
  this.#fBraintree.render();
  */

    pp = new PanelWrapper();
    p.pushPanel(pp);
    if (this._fTerminals.getRegisterId()) {
      this._fTerminals.attachRender(pp);
      this._fTerminals.render();
    }
  }

  #createTitleFragment(text) {
    let s = _CFT_PAYMENT.TITLE;
    s = s.replace("__TEXT__", text);
    return new SimpleText(s);
  };

  #asyncSubmitSquareOnlinePay(locationId, sourceId, orderId) {
    let url = "/api/cart/guest_square_pay";
    if (Account.isAuthenticated()) {
      url = "/api/cart/square_pay";
    }
    let fd = new FormData();
    fd.append("location_id", locationId);
    fd.append("source_id", sourceId);
    fd.append("order_id", orderId);

    api.asyncFragmentPost(this, url, fd).then(d => this.#onOnlinePayRRR(d));
  }

  #onOnlinePayRRR(data) {
    Cart.clear();
    this._delegate.onPaymentSuccessInCartPaymentFragment(this, data.order_id);
  }

  #asyncSubmitTerminalPay(terminalId) {
    let url = "/api/shop/charge_by_terminal";
    let fd = new FormData();
    fd.append("terminal_id", terminalId);
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onTerminalPayRRR(d));
  }

  #onTerminalPayRRR(data) {
    // Payment awaiting on terminal
    // TODO: Invoke waiting view
  }
};
