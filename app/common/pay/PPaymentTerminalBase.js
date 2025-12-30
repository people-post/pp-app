export class PPaymentTerminalBase extends ui.Panel {
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

// Backward compatibility
if (typeof window !== 'undefined') {
  window.pay = window.pay || {};
  window.pay.PPaymentTerminalBase = PPaymentTerminalBase;
}
