import { ListPanel } from './ListPanel.js';

export class NavPanel extends ListPanel {
  constructor() {
    super();
    this._isLoginRequired = false;
  }

  isLoginRequired() { return this._isLoginRequired; }

  setRequireLogin(b) { this._isLoginRequired = b; }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.NavPanel = NavPanel;
}
