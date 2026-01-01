import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PEmailBase extends Panel {
  constructor() {
    super();
    this._pTitle = new Panel();
    this._pContent = new Panel();
    this._pTime = new Panel();
    this._pSender = new Panel();
  }

  isColorInvertible() { return false; }

  getTitlePanel() { return this._pTitle; }
  getContentPanel() { return this._pContent; }
  getTimePanel() { return this._pTime; }
  getSenderPanel() { return this._pSender; }
  getReceiverPanel() { return null; }
  getIconPanel() { return null; }
  getCarbonCopyPanel() { return null; }

  invertColor() {}
};
