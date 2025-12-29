import { Panel } from './Panel.js';

export class PTabbedPaneTabBase extends Panel {
  getIconPanel() { return null; }
  getNamePanel() { return null; }
  getBadgePanel() { return null; }
  getCloseBtnPanel() { return null; }

  invertColor(b) {}
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.PTabbedPaneTabBase = PTabbedPaneTabBase;
}
