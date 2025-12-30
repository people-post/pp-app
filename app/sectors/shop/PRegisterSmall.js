
const _CPT_REGISTER_SMALL = {
  MAIN :
      `<div id="__ID_MAIN__" class="bd-b-solid bd-b-1px bdlightgray clickable">
  <div class="pad5px">
    <div id="__ID_NAME__"></div>
    <div id="__ID_TERMINAL_INFO__"></div>
  </div>
  </div>`,
};

import { PRegisterBase } from './PRegisterBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PRegisterSmall extends PRegisterBase {
  constructor() {
    super();
    this._pName = new Panel();
    this._pTerminalInfo = new Panel();
  }

  isColorInvertible() { return true; }

  getNamePanel() { return this._pName; }
  getTerminalInfoPanel() { return this._pTerminalInfo; }

  invertColor() {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = e.className.replace("bdlightgray", "s-cprimebd");
    }
  }

  _renderFramework() {
    let s = _CPT_REGISTER_SMALL.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_TERMINAL_INFO__", this._getSubElementId("R"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pTerminalInfo.attach(this._getSubElementId("R"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PRegisterSmall = PRegisterSmall;
}
