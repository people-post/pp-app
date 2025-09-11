(function(pay) {
const _CPT_PAYMENT_TERMINAL = {
  MAIN : `<div class="flex flex-start">
    <div id="__ID_NAME_DECOR__"></div>
    <div id="__ID_NAME__"></div>
  </div>
  <div id="__ID_STATUS__"></div>
  <div id="__ID_DETAIL__"></div>`,
};

class PPaymentTerminal extends pay.PPaymentTerminalBase {
  constructor() {
    super();
    this._pNameDecor = new ui.Panel();
    this._pNameEditor = new ui.PanelWrapper();
    this._pDetail = new ui.PanelWrapper();
  }

  getNameDecorationPanel() { return this._pNameDecor; }
  getNameEditorPanel() { return this._pNameEditor; }
  getDetailPanel() { return this._pDetail; }

  _renderFramework() {
    let s = _CPT_PAYMENT_TERMINAL.MAIN;
    s = s.replace("__ID_NAME_DECOR__", this._getSubElementId("ND"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_DETAIL__", this._getSubElementId("D"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pNameDecor.attach(this._getSubElementId("ND"));
    this._pNameEditor.attach(this._getSubElementId("N"));
    this._pDetail.attach(this._getSubElementId("D"));
    this._pStatus.attach(this._getSubElementId("S"));
  }
};

pay.PPaymentTerminal = PPaymentTerminal;
}(window.pay = window.pay || {}));
