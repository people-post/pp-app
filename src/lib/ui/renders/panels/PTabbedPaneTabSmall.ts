import { PTabbedPaneTabBase } from './PTabbedPaneTabBase.js';
import { Panel } from './Panel.js';

const _CPT_TABBED_PANE_TAB_SMALL = {
  MAIN :
      `<div id="__ID_MAIN__" class="tabbed-pane-tab tw-flex tw-justify-start tw-items-center tw-border-solid clickable tw-p-[5px] tw-text-s-font5 s-cinfotext tw-border tw-border-[1px] tw-border-lightgrey tw-border-b-0">
    <div id="__ID_ICON__" class="tw-inline-block tw-w-s-icon5 tw-h-s-icon5 v-middle-align"></div>
    <div id="__ID_NAME__"></div>
    <div id="__ID_BADGE__" class="tw-inline-block tw-bg-red-600 tw-text-white tw-rounded-full tw-px-[5px] tw-py-[1px]"></div>
    <div id="__ID_BTN_CLOSE__" class="tw-inline-block tw-w-s-icon5 tw-h-s-icon5 v-middle-align"></div>
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
            e.className.replace("tw-border-b-0", "tw-border-b-2 tw-font-bold s-cfuncbd-b");
      }
    }
  }

  _renderFramework(): string {
    let s: string = _CPT_TABBED_PANE_TAB_SMALL.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M")) as string;
    s = s.replace("__ID_ICON__", this._getSubElementId("I")) as string;
    s = s.replace("__ID_NAME__", this._getSubElementId("N")) as string;
    s = s.replace("__ID_BADGE__", this._getSubElementId("B")) as string;
    s = s.replace("__ID_BTN_CLOSE__", this._getSubElementId("C")) as string;
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

