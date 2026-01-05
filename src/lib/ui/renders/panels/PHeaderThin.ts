import { PHeader } from './PHeader.js';
import { PanelWrapper } from './PanelWrapper.js';
import { Panel } from './Panel.js';

const _CPT_HEADER_THIN = {
  MAIN : `<div class="flex h-header">
    <div id="__ID_NAV__" class="flex flex-column flex-center"></div>
    <div id="__ID_MENU_0__" class="flex flex-column flex-center"></div>
    <div id="__ID_MENU_1__" class="flex flex-column flex-center"></div>
    <div id="__ID_MENU_2__" class="flex flex-column flex-center"></div>
    <div id="__ID_SPACE__" class="flex-grow"></div>
    <div id="__ID_ACTION__" class="flex flex-column flex-center"></div>
  </div>
  <div id="__ID_MENU_CONTENT__" class="header-menu-content"></div>`,
} as const;

export class PHeaderThin extends PHeader {
  #isNavEnabled: boolean = false;
  declare _pNav: PanelWrapper;
  declare _pMenus: PanelWrapper[];
  declare _pAction: PanelWrapper;
  declare _pSpace: Panel;

  constructor() {
    super();
    this._pNav = new PanelWrapper();
    this._pMenus =
        [ new PanelWrapper(), new PanelWrapper(), new PanelWrapper() ];
    this._pAction = new PanelWrapper();
    this._pSpace = new Panel();
  }

  getNavPanel(): PanelWrapper | null { return this.#isNavEnabled ? this._pNav : null; }
  getMenuPanel(i: number): PanelWrapper | null { return this._pMenus[i] || null; }
  getActionPanel(): PanelWrapper { return this._pAction; }
  getMenuContentElementId(): string { return this._getSubElementId("C"); }

  setEnableNav(b: boolean): void { this.#isNavEnabled = b; }

  expandPanelIfPossible(i: number): void {
    let p = this._pMenus[i];
    if (p) {
      p.setClassName("flex flex-column flex-center flex-grow");
      this._pSpace.setClassName("");
    }
  }

  _renderFramework(): string {
    let s: string = _CPT_HEADER_THIN.MAIN;
    s = s.replace("__ID_NAV__", this._getSubElementId("N"));
    s = s.replace("__ID_MENU_0__", this._getSubElementId("M0")) as string;
    s = s.replace("__ID_MENU_1__", this._getSubElementId("M1")) as string;
    s = s.replace("__ID_MENU_2__", this._getSubElementId("M2")) as string;
    s = s.replace("__ID_SPACE__", this._getSubElementId("S")) as string;
    s = s.replace("__ID_ACTION__", this._getSubElementId("A")) as string;
    s = s.replace("__ID_MENU_CONTENT__", this._getSubElementId("C")) as string;
    return s;
  }

  _onFrameworkDidAppear(): void {
    this._pNav.attach(this._getSubElementId("N"));
    this._pMenus[0].attach(this._getSubElementId("M0"));
    this._pMenus[1].attach(this._getSubElementId("M1"));
    this._pMenus[2].attach(this._getSubElementId("M2"));
    this._pSpace.attach(this._getSubElementId("S"));
    this._pAction.attach(this._getSubElementId("A"));
    this._initMenuContentAnimationHandler(this._getSubElementId("C"));
  }
}

