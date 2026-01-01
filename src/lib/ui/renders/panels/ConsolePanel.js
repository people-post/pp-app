import { Panel } from './Panel.js';

export class ConsolePanel extends Panel {
  constructor() {
    super();
    this._pHomeBtn = new Panel();
  }

  getHomeBtnPanel() { return this._pHomeBtn; }
  getTabPanel() { return null; }
  getNavPanel(i) { return null; }

  clearNavPanels() {}
};
