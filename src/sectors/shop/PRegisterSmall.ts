
const _CPT_REGISTER_SMALL = {
  MAIN :
      `<div id="__ID_MAIN__" class="bd-b-solid bd-b-1px bdlightgray clickable">
  <div class="pad5px">
    <div id="__ID_NAME__"></div>
    <div id="__ID_TERMINAL_INFO__"></div>
  </div>
  </div>`,
} as const;

import { PRegisterBase } from './PRegisterBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PRegisterSmall extends PRegisterBase {
  protected _pName: Panel;
  protected _pTerminalInfo: Panel;

  constructor() {
    super();
    this._pName = new Panel();
    this._pTerminalInfo = new Panel();
  }

  isColorInvertible(): boolean { return true; }

  getNamePanel(): Panel { return this._pName; }
  getTerminalInfoPanel(): Panel { return this._pTerminalInfo; }

  invertColor(): void {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = e.className.replace("bdlightgray", "s-cprimebd");
    }
  }

  _renderFramework(): string {
    let s = _CPT_REGISTER_SMALL.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_TERMINAL_INFO__", this._getSubElementId("R"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pTerminalInfo.attach(this._getSubElementId("R"));
  }
}
