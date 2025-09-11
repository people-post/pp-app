(function(ui) {
class PTabbedPaneTabBase extends ui.Panel {
  getIconPanel() { return null; }
  getNamePanel() { return null; }
  getBadgePanel() { return null; }
  getCloseBtnPanel() { return null; }

  invertColor(b) {}
};

ui.PTabbedPaneTabBase = PTabbedPaneTabBase;
}(window.ui = window.ui || {}));
