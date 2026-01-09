const _CPT_BRANCH = {
  MAIN : `<div class="flex flex-start">
    <div id="__ID_NAME_DECOR__"></div>
    <div id="__ID_NAME__"></div>
  </div>
  <div id="__ID_ADDRESS__"></div>
  <div id="__ID_REGISTERS__"></div>`,
} as const;

import { PBranchBase } from './PBranchBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PBranch extends PBranchBase {
  private _pNameEditor: PanelWrapper;
  private _pNameDecor: Panel;
  private _pAddress: PanelWrapper;
  private _pRegisters: PanelWrapper;

  constructor() {
    super();
    this._pNameEditor = new PanelWrapper();
    this._pNameDecor = new Panel();
    this._pAddress = new PanelWrapper();
    this._pRegisters = new PanelWrapper();
  }

  getNameDecorationPanel(): Panel { return this._pNameDecor; }
  getNameEditorPanel(): PanelWrapper { return this._pNameEditor; }
  getAddressPanel(): PanelWrapper { return this._pAddress; }
  getRegisterListPanel(): PanelWrapper { return this._pRegisters; }

  _renderFramework(): string {
    let s = _CPT_BRANCH.MAIN;
    s = s.replace("__ID_NAME_DECOR__", this._getSubElementId("ND"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ADDRESS__", this._getSubElementId("A"));
    s = s.replace("__ID_REGISTERS__", this._getSubElementId("R"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pNameDecor.attach(this._getSubElementId("ND"));
    this._pNameEditor.attach(this._getSubElementId("N"));
    this._pAddress.attach(this._getSubElementId("A"));
    this._pRegisters.attach(this._getSubElementId("R"));
  }
};
