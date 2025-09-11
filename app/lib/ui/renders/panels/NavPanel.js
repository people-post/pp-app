(function(ui) {
class NavPanel extends ui.ListPanel {
  constructor() {
    super();
    this._isLoginRequired = false;
  }

  isLoginRequired() { return this._isLoginRequired; }

  setRequireLogin(b) { this._isLoginRequired = b; }
};

ui.NavPanel = NavPanel;
}(window.ui = window.ui || {}));
