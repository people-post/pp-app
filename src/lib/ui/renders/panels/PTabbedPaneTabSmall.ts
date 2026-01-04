import { PTabbedPaneTabBase } from './PTabbedPaneTabBase.js';
import { Panel } from './Panel.js';

const _CPT_TABBED_PANE_TAB_SMALL = {
  MAIN :
      `<div id="__ID_MAIN__" class="tabbed-pane-tab flex flex-start center-align-items bdsolid clickable pad5px s-font5 s-cinfotext bd1px bdlightgrey bd-b-0px">
    <div id="__ID_ICON__" class="inline-block s-icon5 v-middle-align"></div>
    <div id="__ID_NAME__"></div>
    <div id="__ID_BADGE__" class="inline-block bgred cwhite bdradius50 h-pad5px v-pad1px"></div>
    <div id="__ID_BTN_CLOSE__" class="inline-block s-icon5 v-middle-align"></div>
  </div>`,
} as const;

export class PTabbedPaneTabSmall extends PTabbedPaneTabBase {
  declare _pIcon: Panel;
  declare _pName: Panel;
  declare _pBadge: Panel;
  declare _pBtnClose: Panel;

  constructor() {
    super();
    this._pIcon = new Panel();
    this._pName = new Panel();
    this._pBadge = new Panel();
    this._pBtnClose = new Panel();
  }

  getIconPanel(): Panel { return this._pIcon; }
  getNamePanel(): Panel { return this._pName; }
  getBadgePanel(): Panel { return this._pBadge; }
  getCloseBtnPanel(): Panel { return this._pBtnClose; }

  invertColor(b: boolean): void {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      if (b) {
        e.className =
            e.className.replace("bd-b-0px", "bd-b-2px bold s-cfuncbd-b");
      }
    }
  }

  _renderFramework(): string {
    let s = _CPT_TABBED_PANE_TAB_SMALL.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_BADGE__", this._getSubElementId("B"));
    s = s.replace("__ID_BTN_CLOSE__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pIcon.attach(this._getSubElementId("I"));
    this._pName.attach(this._getSubElementId("N"));
    this._pBadge.attach(this._getSubElementId("B"));
    this._pBtnClose.attach(this._getSubElementId("C"));
  }
}

