import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PWalkinQueueItemBase extends Panel {
  constructor() {
    super();
    this._pName = new Panel();
  }

  getNameDecorPanel() { return null; }
  getNamePanel() { return this._pName; }
  getActionPanel(idx) { return null; }
  getAgentPanel() { return null; }

  invertColor() {}
};
