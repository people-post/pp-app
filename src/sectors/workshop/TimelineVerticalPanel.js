import { TimelinePanel } from './TimelinePanel.js';
import { TimelineVerticalNodePanel } from './TimelineVerticalNodePanel.js';

export class TimelineVerticalPanel extends TimelinePanel {
  _createNodePanel() { return new TimelineVerticalNodePanel(); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.TimelineVerticalPanel = TimelineVerticalPanel;
}
