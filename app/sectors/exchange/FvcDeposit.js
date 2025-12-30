import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Selection } from '../../lib/ui/controllers/fragments/Selection.js';
import { NumberInput } from '../../lib/ui/controllers/fragments/NumberInput.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcNotice } from '../../lib/ui/controllers/views/FvcNotice.js';
import { FSquareOnline } from '../../common/pay/FSquareOnline.js';
import { api } from '../../common/plt/Api.js';
import { R } from '../../common/constants/R.js';

export class FvcDeposit extends FScrollViewContent {
  constructor() {
    super();
    this._fCurrencies = new Selection();
    this._fInput = new NumberInput();
    this._fInput.setConfig({
      min : 0,
      max : 1000000,
      step : 1,
      value : 0,
      title : "How much do you want to deposit?"
    });
    this._fSquare = new FSquareOnline();
    this._fSquare.setDelegate(this);
    this.setChild("input", this._fInput);
    this.setChild("payment", this._fSquare);
    this._selectedCurrency = "USD";
  }

  getSelectedValueForSelection(fSelection) { this._selectedCurrency; }
  getItemsForSelection(fSelection) { return [ {text : "USD", value : "USD"} ]; }

  onSelectionChangedInSelection(fSelection, value) {
    this._selectedCurrency = value;
  }

  onSquareOnlinePayFragmentRequestPay(fSquare, locationId, sourceId) {
    let amount = this._fInput.getValue();
    this.#asyncSubmitPayment(locationId, sourceId, amount,
                             this._selectedCurrency);
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fInput.attachRender(pp);
    this._fInput.render();

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fSquare.attachRender(pp);
    this._fSquare.render();
  }

  #asyncSubmitPayment(locationId, sourceId, amount, currency) {
    let url = '/api/exchange/deposit';
    let fd = new FormData();
    fd.append("location_id", locationId);
    fd.append("source_id", sourceId);
    fd.append("amount", amount);
    fd.append("currency", currency);

    api.asyncFragmentPost(this, url, fd).then(d => this.#onPayRRR(d));
  }

  #onPayRRR(data) {
    let v = new View();
    let f = new FvcNotice();
    f.setMessage(R.get("ACK_DEPOSIT"));
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v, "Notice");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.xchg = window.xchg || {};
  window.xchg.FvcDeposit = FvcDeposit;
}
