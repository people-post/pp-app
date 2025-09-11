(function(pay) {
class FvcPaymentTerminal extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fTerminal = new pay.FPaymentTerminal();
    this._fTerminal.setDelegate(this);
    this.setChild("terminal", this._fTerminal);
  }

  setTerminalId(id) { this._fTerminal.setTerminalId(id); }
  setEnableEdit(b) { this._fTerminal.setEnableEdit(b); }

  onPaymentTerminalFragmentRequestShowView(fTerminal, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }
  onClickInPaymentTerminalFragment(fTerminal, terminalId) {}

  _renderContentOnRender(render) {
    this._fTerminal.attachRender(render);
    this._fTerminal.render();
  }
};

pay.FvcPaymentTerminal = FvcPaymentTerminal;
}(window.pay = window.pay || {}));
