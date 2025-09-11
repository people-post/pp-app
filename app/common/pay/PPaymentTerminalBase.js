(function(pay) {
class PPaymentTerminalBase extends ui.Panel {
  constructor() {
    super();
    this._pStatus = new ui.Panel();
  }

  isColorInvertible() { return false; }

  getNameDecorationPanel() { return null; }
  getNamePanel() { return null; }
  getNameEditorPanel() { return null; }
  getDetailPanel() { return null; }
  getStatusPanel() { return this._pStatus; }

  invertColor() {}
};

pay.PPaymentTerminalBase = PPaymentTerminalBase;
}(window.pay = window.pay || {}));
