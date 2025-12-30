import { PPaymentTerminalBase } from './PPaymentTerminalBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

const _CPT_PAYMENT_TERMINAL = {
  MAIN : `<div class="flex flex-start">
    <div id="__ID_NAME_DECOR__"></div>
    <div id="__ID_NAME__"></div>
  </div>
  <div id="__ID_STATUS__"></div>
  <div id="__ID_DETAIL__"></div>`,
};

export class PPaymentTerminal extends PPaymentTerminalBase {
  constructor() {
    super();
    this._pNameDecor = new Panel();
    this._pNameEditor = new PanelWrapper();
    this._pDetail = new PanelWrapper();
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

// Backward compatibility
if (typeof window !== 'undefined') {
  window.pay = window.pay || {};
  window.pay.PPaymentTerminal = PPaymentTerminal;
}
