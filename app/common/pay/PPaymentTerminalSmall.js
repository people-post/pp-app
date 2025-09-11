(function(pay) {
const _CPT_PAYMENT_TERMINAL_SMALL = {
  MAIN :
      `<div id="__ID_MAIN__" class="bd-b-solid bd-b-1px bdlightgray clickable">
  <div class="pad5px">
    <div id="__ID_NAME__"></div>
    <div id="__ID_STATUS__"></div>
  </div>
  </div>`,
};

class PPaymentTerminalSmall extends pay.PPaymentTerminalBase {
  constructor() {
    super();
    this._pName = new ui.Panel();
  }

  isColorInvertible() { return true; }

  getNamePanel() { return this._pName; }

  invertColor() {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = e.className.replace("bdlightgray", "s-cprimebd");
    }
  }

  _renderFramework() {
    let s = _CPT_PAYMENT_TERMINAL_SMALL.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pStatus.attach(this._getSubElementId("S"));
  }
};

pay.PPaymentTerminalSmall = PPaymentTerminalSmall;
}(window.pay = window.pay || {}));
