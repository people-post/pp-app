import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FPaymentTerminal } from './FPaymentTerminal.js';

export class FvcPaymentTerminal extends FScrollViewContent {
  constructor() {
    super();
    this._fTerminal = new FPaymentTerminal();
    this._fTerminal.setDelegate(this);
    this.setChild("terminal", this._fTerminal);
  }

  setTerminalId(id) { this._fTerminal.setTerminalId(id); }
  setEnableEdit(b) { this._fTerminal.setEnableEdit(b); }

  onPaymentTerminalFragmentRequestShowView(fTerminal, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }
  onClickInPaymentTerminalFragment(fTerminal, terminalId) {}

  _renderContentOnRender(render) {
    this._fTerminal.attachRender(render);
    this._fTerminal.render();
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.pay = window.pay || {};
  window.pay.FvcPaymentTerminal = FvcPaymentTerminal;
}
