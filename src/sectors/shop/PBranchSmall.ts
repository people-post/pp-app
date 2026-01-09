const _CPT_BRANCH_SMALL = {
  MAIN :
      `<div id="__ID_MAIN__" class="bd-b-solid bd-b-1px bdlightgray clickable">
  <div class="pad5px">
    <div id="__ID_NAME__"></div>
    <div id="__ID_ADDRESS__"></div>
    <div id="__ID_REGISTER_INFO__"></div>
  </div>
  </div>`,
} as const;

import { PBranchBase } from './PBranchBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PBranchSmall extends PBranchBase {
  private _pName: Panel;
  private _pAddress: PanelWrapper;
  private _pRegisterInfo: Panel;

  constructor() {
    super();
    this._pName = new Panel();
    this._pAddress = new PanelWrapper();
    this._pRegisterInfo = new Panel();
  }

  isColorInvertible(): boolean { return true; }

  getNamePanel(): Panel { return this._pName; }
  getAddressPanel(): PanelWrapper { return this._pAddress; }
  getRegisterInfoPanel(): Panel { return this._pRegisterInfo; }

  invertColor(): void {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = e.className.replace("bdlightgray", "s-cprimebd");
    }
  }

  _renderFramework(): string {
    let s = _CPT_BRANCH_SMALL.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ADDRESS__", this._getSubElementId("A"));
    s = s.replace("__ID_REGISTER_INFO__", this._getSubElementId("R"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pAddress.attach(this._getSubElementId("A"));
    this._pRegisterInfo.attach(this._getSubElementId("R"));
  }
};
