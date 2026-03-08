import { PPaymentTerminalBase } from './PPaymentTerminalBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

const _CPT_PAYMENT_TERMINAL_SMALL = {
  MAIN :
      `<div id="__ID_MAIN__" class="bd-b-solid tw-border-b tw-border-b-[1px] tw-border-gray-300 clickable">
  <div class="tw-p-[5px]">
    <div id="__ID_NAME__"></div>
    <div id="__ID_STATUS__"></div>
  </div>
  </div>`,
};

export class PPaymentTerminalSmall extends PPaymentTerminalBase {
  private _pName: Panel;

  constructor() {
    super();
    this._pName = new Panel();
  }

  isColorInvertible(): boolean { return true; }

  getNamePanel(): Panel { return this._pName; }

  invertColor(): void {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = e.className.replace("tw-border-gray-300", "s-cprimebd");
    }
  }

  _renderFramework(): string {
    let s = _CPT_PAYMENT_TERMINAL_SMALL.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pStatus.attach(this._getSubElementId("S"));
  }
}

export default PPaymentTerminalSmall;
