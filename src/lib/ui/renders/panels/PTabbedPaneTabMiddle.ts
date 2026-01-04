import { PTabbedPaneTabBase } from './PTabbedPaneTabBase.js';
import { Panel } from './Panel.js';

const _CPT_TABBED_PANE_TAB_MIDDLE = {
  MAIN : `<div class="inline-block pad5px clickable">
      <div id="__ID_ICON__" class="bdradius5px inline-block s-icon32 s-csecondarybg"></div>
    </div>
    <div id="__ID_BADGE__" class="notification-badge"></div>`,
} as const;

export class PTabbedPaneTabMiddle extends PTabbedPaneTabBase {
  declare _pIcon: Panel;
  declare _pBadge: Panel;

  constructor() {
    super();
    this._pIcon = new Panel();
    this._pBadge = new Panel();
  }

  getIconPanel(): Panel { return this._pIcon; }
  getBadgePanel(): Panel { return this._pBadge; }

  invertColor(b: boolean): void {
    let e = document.getElementById(this._getSubElementId("I"));
    if (e) {
      if (b) {
        e.className = e.className.replace("s-cfuncbg", "s-csecondarybg");
      } else {
        e.className = e.className.replace("s-csecondarybg", "s-cfuncbg");
      }
    }
  }

  _renderFramework(): string {
    let s = _CPT_TABBED_PANE_TAB_MIDDLE.MAIN;
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_BADGE__", this._getSubElementId("B"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pIcon.attach(this._getSubElementId("I"));
    this._pBadge.attach(this._getSubElementId("B"));
  }
}

