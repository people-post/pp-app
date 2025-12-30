
export class TimelineVerticalPanel extends wksp.TimelinePanel {
  _createNodePanel() { return new wksp.TimelineVerticalNodePanel(); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.TimelineVerticalPanel = TimelineVerticalPanel;
}
