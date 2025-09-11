(function(gui) {
class MenuContent extends ui.Fragment {
  constructor() {
    super();
    this._isQuickLinkRenderMode = false;
  }

  getQuickLinkMinWidth() { return 200; }

  setQuickLinkRenderMode(b) { this._isQuickLinkRenderMode = b; }
  resetStatus() { this.setQuickLinkRenderMode(false); }
};

gui.MenuContent = MenuContent;
}(window.gui = window.gui || {}));
