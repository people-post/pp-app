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

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.ConsolePanel = ConsolePanel;
}
