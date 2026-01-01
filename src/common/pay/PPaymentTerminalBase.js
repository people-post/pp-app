import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PPaymentTerminalBase extends Panel {
  constructor() {
    super();
    this._pStatus = new Panel();
  }

  isColorInvertible() { return false; }

  getNameDecorationPanel() { return null; }
  getNamePanel() { return null; }
  getNameEditorPanel() { return null; }
  getDetailPanel() { return null; }
  getStatusPanel() { return this._pStatus; }

  invertColor() {}
};
