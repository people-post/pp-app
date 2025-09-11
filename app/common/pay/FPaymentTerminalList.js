(function(pay) {
class FPaymentTerminalList extends ui.Fragment {
  constructor() {
    super();
    this._fItems = new ui.FSimpleFragmentList();
    this.setChild("items", this._fItems);

    this._fBtnAdd = new ui.Button();
    this._fBtnAdd.setName("+New payment device...");
    this._fBtnAdd.setDelegate(this);
    this.setChild("btnAdd", this._fBtnAdd);

    this._registerId = null;
    this._ids = null;
    this._selectedId = null;
    this._isEditEnabled = false;
  }

  getRegisterId() { return this._registerId; }

  setRegisterId(id) { this._registerId = id; }
  setEnableEdit(b) { this._isEditEnabled = b; }

  isTerminalSelectedInPaymentTerminalFragment(fTerminal, terminalId) {
    return this._selectedId == terminalId;
  }

  onSimpleButtonClicked(fBtn) { this.#asyncStartAdd(); }
  onPaymentTerminalFragmentRequestShowView(fTerminal, view, title) {
    this._delegate.onPaymentTerminalListFragmentRequestShowView(this, view,
                                                                title);
  }
  onClickInPaymentTerminalFragment(fTerminal, terminalId) {
    this._selectedId = terminalId;
    this.render();
    this._delegate.onPaymentTerminalSelectedInPaymentTerminalListFragment(
        this, terminalId);
  }

  _renderOnRender(render) {
    if (!this._ids) {
      this.#asyncGetTerminalIds();
      return;
    }

    let pMain = new ui.ListPanel();
    render.wrapPanel(pMain);
    let p = new ui.PanelWrapper();
    pMain.pushPanel(p);

    this._fItems.clear();
    for (let id of this._ids) {
      let f = new pay.FPaymentTerminal();
      f.setLayoutType(pay.FPaymentTerminal.T_LAYOUT.SMALL);
      f.setTerminalId(id);
      f.setEnableEdit(this._isEditEnabled);
      f.setDataSource(this);
      f.setDelegate(this);
      this._fItems.append(f);
    }
    this._fItems.attachRender(p);
    this._fItems.render();

    pMain.pushSpace(1);

    if (this._isEditEnabled) {
      p = new ui.PanelWrapper();
      pMain.pushPanel(p);
      this._fBtnAdd.attachRender(p);
      this._fBtnAdd.render();
    }
  }

  #asyncGetTerminalIds() {
    let url = "api/shop/payment_terminal_ids";
    let fd = new FormData();
    fd.append("register_id", this._registerId);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onTerminalIdsRRR(d));
  }

  #onTerminalIdsRRR(data) {
    this._ids = data.ids;
    this.render();
  }

  #asyncStartAdd() {
    this._confirmDangerousOperation(
        "Currently only support square terminal. Do you want to preceed?",
        () => this.#asyncAdd());
  }

  #asyncAdd() {
    let url = "api/shop/add_terminal";
    let fd = new FormData();
    fd.append("register_id", this._registerId);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onAddTerminalRRR(d));
  }

  #onAddTerminalRRR(data) {
    if (this._ids) {
      let t = new dat.PaymentTerminal(data.terminal);
      this._ids.push(t.getId());
    }
    this.render();
  }
};

pay.FPaymentTerminalList = FPaymentTerminalList;
}(window.pay = window.pay || {}));
