import { PTabbedPaneTabBase } from './PTabbedPaneTabBase.js';
import { Panel } from './Panel.js';

const _CPT_TABBED_PANE_TAB_LARGE = {
  MAIN :
      `<div id="__ID_MAIN__" class="tab-item center-align relative s-csecondarybg">
    <div class="inline-block pad5px clickable">
      <div id="__ID_ICON__" class="inline-block s-icon4"></div>
    </div>
    <div id="__ID_BADGE__" class="notification-badge"></div>
  </div>`,
} as const;

export class PTabbedPaneTabLarge extends PTabbedPaneTabBase {
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
    if (b) {
      let e = document.getElementById(this._getSubElementId("M"));
      if (e) {
        e.className = e.className.replace("s-csecondarybg", "s-cfuncbg");
      }
    }
  }

  _renderFramework(): string {
    let s: string = _CPT_TABBED_PANE_TAB_LARGE.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M")) as string;
    s = s.replace("__ID_ICON__", this._getSubElementId("I")) as string;
    s = s.replace("__ID_BADGE__", this._getSubElementId("B")) as string;
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pIcon.attach(this._getSubElementId("I"));
    this._pBadge.attach(this._getSubElementId("B"));
  }
}

