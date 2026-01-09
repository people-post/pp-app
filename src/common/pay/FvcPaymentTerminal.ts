import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FPaymentTerminal } from './FPaymentTerminal.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class FvcPaymentTerminal extends FScrollViewContent {
  private _fTerminal: FPaymentTerminal;

  constructor() {
    super();
    this._fTerminal = new FPaymentTerminal();
    this._fTerminal.setDelegate(this);
    this.setChild("terminal", this._fTerminal);
  }

  setTerminalId(id: string): void { this._fTerminal.setTerminalId(id); }
  setEnableEdit(b: boolean): void { this._fTerminal.setEnableEdit(b); }

  onPaymentTerminalFragmentRequestShowView(_fTerminal: FPaymentTerminal, view: View, title: string): void {
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, view, title);
  }
  onClickInPaymentTerminalFragment(_fTerminal: FPaymentTerminal, _terminalId: string): void {}

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this._fTerminal.attachRender(render);
    this._fTerminal.render();
  }
}

export default FvcPaymentTerminal;
