import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PPaymentTerminalBase extends Panel {
  protected _pStatus: Panel;

  constructor() {
    super();
    this._pStatus = new Panel();
  }

  isColorInvertible(): boolean { return false; }

  getNameDecorationPanel(): Panel | null { return null; }
  getNamePanel(): Panel | null { return null; }
  getNameEditorPanel(): Panel | null { return null; }
  getDetailPanel(): Panel | null { return null; }
  getStatusPanel(): Panel { return this._pStatus; }

  invertColor(): void {}
}

export default PPaymentTerminalBase;
