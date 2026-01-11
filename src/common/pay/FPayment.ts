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
import { Cart } from '../dba/Cart.js';
import { Api } from '../plt/Api.js';
import { Account } from '../dba/Account.js';

const _CFT_PAYMENT = {
  TITLE : `<div class="payment-choice-title">__TEXT__</div>`,
}

export class FPayment extends Fragment {
  #fSquare: FoldableItemFragment;
  #fBraintree: FBraintree;
  private _fAsset: FoldableItemFragment;
  private _fTerminals: FPaymentTerminalList;
  private _fSelected: FoldableItemFragment | null = null;

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

  setRegisterId(id: string | null): void { this._fTerminals.setRegisterId(id); }

  onFoldableItemOpen(fItem: FoldableItemFragment, _itemId: string): void {
    if (this._fSelected) {
      this._fSelected.close();
    }
    this._fSelected = fItem;
  }
  onFoldableItemClose(_fItem: FoldableItemFragment, _itemId: string): void { this._fSelected = null; }

  onSquareOnlinePayFragmentRequestPay(_fSquare: FSquareOnline, locationId: string, sourceId: string): void {
    // @ts-expect-error - dataSource may have this method
    let order = this._dataSource?.getOrderForCartPaymentFragment?.(this);
    if (order) {
      this.#asyncSubmitSquareOnlinePay(locationId, sourceId, order.getId());
    }
  }
  onPaymentTerminalSelectedInPaymentTerminalListFragment(_fTerminalList: FPaymentTerminalList,
                                                         terminalId: string): void {
    this.#asyncSubmitTerminalPay(terminalId);
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.ASSET:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    // @ts-expect-error - dataSource may have this method
    let order = this._dataSource?.getOrderForCartPaymentFragment?.(this);
    if (order) {
      let nAsset = Exchange.getAsset(order.getCurrencyId());
      if (nAsset && nAsset >= order.getTotal()) {
        let pp = new PanelWrapper();
        p.pushPanel(pp);

        this._fAsset.setIsOpen(this._fSelected == this._fAsset);
        this._fAsset.attachRender(pp);
        this._fAsset.render();
      }
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

  #createTitleFragment(text: string): SimpleText {
    let s = _CFT_PAYMENT.TITLE;
    s = s.replace("__TEXT__", text);
    return new SimpleText(s);
  }

  #asyncSubmitSquareOnlinePay(locationId: string, sourceId: string, orderId: string): void {
    let url = "/api/cart/guest_square_pay";
    if (Account.isAuthenticated()) {
      url = "/api/cart/square_pay";
    }
    let fd = new FormData();
    fd.append("location_id", locationId);
    fd.append("source_id", sourceId);
    fd.append("order_id", orderId);

    Api.asFragmentPost(this, url, fd).then(d => this.#onOnlinePayRRR(d));
  }

  #onOnlinePayRRR(data: { order_id: string }): void {
    Cart.clear();
    // @ts-expect-error - delegate may have this method
    this._delegate?.onPaymentSuccessInCartPaymentFragment?.(this, data.order_id);
  }

  #asyncSubmitTerminalPay(terminalId: string): void {
    let url = "/api/shop/charge_by_terminal";
    let fd = new FormData();
    fd.append("terminal_id", terminalId);
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onTerminalPayRRR(d));
  }

  #onTerminalPayRRR(_data: unknown): void {
    // Payment awaiting on terminal
    // TODO: Invoke waiting view
  }
}

export default FPayment;
