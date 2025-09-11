(function(ui) {
class PHeader extends ui.Panel {
  #animationEndHandler;

  getNavPanel() { return null; }
  getMenuPanel(i) { return null; }
  getActionPanel() { return null; }
  getMenuContentElementId() { return null; }

  setEnableNav(b) {}
  setAnimationEndHandler(fcn) { this.#animationEndHandler = fcn; }

  expandPanelIfPossible(i) {}

  _initMenuContentAnimationHandler(elementId) {
    let e = document.getElementById(elementId);
    if (e) {
      e.addEventListener("animationend", () => this.#onMenuClosed());
      e.addEventListener("webkitAnimationEnd", () => this.#onMenuClosed());
    }
  }

  #onMenuClosed() {
    if (this.#animationEndHandler) {
      this.#animationEndHandler();
    }
  }
};

ui.PHeader = PHeader;
}(window.ui = window.ui || {}));
