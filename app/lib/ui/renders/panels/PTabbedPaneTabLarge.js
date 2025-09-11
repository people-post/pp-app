(function(ui) {
const _CPT_TABBED_PANE_TAB_LARGE = {
  MAIN :
      `<div id="__ID_MAIN__" class="tab-item center-align relative s-csecondarybg">
    <div class="inline-block pad5px clickable">
      <div id="__ID_ICON__" class="inline-block s-icon4"></div>
    </div>
    <div id="__ID_BADGE__" class="notification-badge"></div>
  </div>`,
}

class PTabbedPaneTabLarge extends ui.PTabbedPaneTabBase {
  constructor() {
    super();
    this._pIcon = new ui.Panel();
    this._pBadge = new ui.Panel();
  }

  getIconPanel() { return this._pIcon; }
  getBadgePanel() { return this._pBadge; }

  invertColor(b) {
    if (b) {
      let e = document.getElementById(this._getSubElementId("M"));
      if (e) {
        e.className = e.className.replace("s-csecondarybg", "s-cfuncbg");
      }
    }
  }

  _renderFramework() {
    let s = _CPT_TABBED_PANE_TAB_LARGE.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_BADGE__", this._getSubElementId("B"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pIcon.attach(this._getSubElementId("I"));
    this._pBadge.attach(this._getSubElementId("B"));
  }
};

ui.PTabbedPaneTabLarge = PTabbedPaneTabLarge;
}(window.ui = window.ui || {}));
