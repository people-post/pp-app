(function(ui) {
class ConsolePanel extends ui.Panel {
  constructor() {
    super();
    this._pHomeBtn = new ui.Panel();
  }


  getHomeBtnPanel() { return this._pHomeBtn; }
  getTabPanel() { return null; }
  getNavPanel(i) { return null; }

  clearNavPanels() {}
};

ui.ConsolePanel = ConsolePanel;
}(window.ui = window.ui || {}));
