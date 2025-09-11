(function(xchg) {
class FvcDeposit extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fCurrencies = new ui.Selection();
    this._fInput = new ui.NumberInput();
    this._fInput.setConfig({
      min : 0,
      max : 1000000,
      step : 1,
      value : 0,
      title : "How much do you want to deposit?"
    });
    this._fSquare = new pay.FSquareOnline();
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
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this._fInput.attachRender(pp);
    this._fInput.render();

    pp = new ui.PanelWrapper();
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

    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onPayRRR(d));
  }

  #onPayRRR(data) {
    let v = new ui.View();
    let f = new ui.FvcNotice();
    f.setMessage(R.get("ACK_DEPOSIT"));
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v, "Notice");
  }
};

xchg.FvcDeposit = FvcDeposit;
}(window.xchg = window.xchg || {}));
