import { PTabbedPaneTabBase } from './PTabbedPaneTabBase.js';
import { Panel } from './Panel.js';

const _CPT_TABBED_PANE_TAB_MIDDLE = {
  MAIN : `<div class="inline-block pad5px clickable">
      <div id="__ID_ICON__" class="bdradius5px inline-block s-icon32 s-csecondarybg"></div>
    </div>
    <div id="__ID_BADGE__" class="notification-badge"></div>`,
}

export class PTabbedPaneTabMiddle extends PTabbedPaneTabBase {
  constructor() {
    super();
    this._pIcon = new Panel();
    this._pBadge = new Panel();
  }

  getIconPanel() { return this._pIcon; }
  getBadgePanel() { return this._pBadge; }

  invertColor(b) {
    let e = document.getElementById(this._getSubElementId("I"));
    if (e) {
      if (b) {
        e.className = e.className.replace("s-cfuncbg", "s-csecondarybg");
      } else {
        e.className = e.className.replace("s-csecondarybg", "s-cfuncbg");
      }
    }
  }

  _renderFramework() {
    let s = _CPT_TABBED_PANE_TAB_MIDDLE.MAIN;
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

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.PTabbedPaneTabMiddle = PTabbedPaneTabMiddle;
}
