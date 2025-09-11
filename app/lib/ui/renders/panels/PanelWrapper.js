(function(ui) {
class PanelWrapper extends ui.Panel {
  #pContent = null;

  getContentPanel() { return this.#pContent; }

  wrapPanel(panel) {
    let id = this._getSubElementId("C");
    let s = panel.createElement(id).outerHTML;
    let wrapperId = this._getSubElementId("WC");
    let sWrapper = this._getWrapperFramework(wrapperId);
    if (sWrapper) {
      this.replaceContent(sWrapper);
      this._onWrapperFrameworkDidAppear();
      let e = document.getElementById(wrapperId);
      if (e) {
        e.innerHTML = s;
      }
    } else {
      this.replaceContent(s);
    }
    panel.attach(id);
    this.#pContent = panel;
  }

  _getWrapperFramework(wrapperElementId) { return null; }

  _onWrapperFrameworkDidAppear() {}
};

ui.PanelWrapper = PanelWrapper;
}(window.ui = window.ui || {}));
