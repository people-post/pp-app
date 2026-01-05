import { PHeader } from './PHeader.js';
import { PanelWrapper } from './PanelWrapper.js';

const _CPT_HEADER_THICK = {
  MAIN : `<div class="flex h-header">
    <div id="__ID_NAV__" class="flex flex-column flex-center"></div>
    <div id="__ID_MENU_1__" class="flex flex-column flex-center flex-grow"></div>
    <div id="__ID_ACTION__" class="flex flex-column flex-center"></div>
  </div>
  <div id="__ID_MENU_0__" class="h-subheader flex flex-column flex-center"></div>
  <div id="__ID_MENU_CONTENT__" class="header-menu-content"></div>`,
} as const;

export class PHeaderThick extends PHeader {
  #isNavEnabled: boolean = false;
  declare _pNav: PanelWrapper;
  declare _pMenus: PanelWrapper[];
  declare _pAction: PanelWrapper;

  constructor() {
    super();
    this._pNav = new PanelWrapper();
    this._pMenus = [ new PanelWrapper(), new PanelWrapper() ];
    this._pAction = new PanelWrapper();
  }

  getNavPanel(): PanelWrapper | null { return this.#isNavEnabled ? this._pNav : null; }
  getMenuPanel(i: number): PanelWrapper | null { return this._pMenus[i] || null; }
  getActionPanel(): PanelWrapper { return this._pAction; }
  getMenuContentElementId(): string { return this._getSubElementId("C"); }

  setEnableNav(b: boolean): void { this.#isNavEnabled = b; }

  _renderFramework(): string {
    let s: string = _CPT_HEADER_THICK.MAIN;
    s = s.replace("__ID_NAV__", this._getSubElementId("N"));
    s = s.replace("__ID_MENU_0__", this._getSubElementId("M0")) as string;
    s = s.replace("__ID_MENU_1__", this._getSubElementId("M1")) as string;
    s = s.replace("__ID_ACTION__", this._getSubElementId("A")) as string;
    s = s.replace("__ID_MENU_CONTENT__", this._getSubElementId("C")) as string;
    return s;
  }

  _onFrameworkDidAppear(): void {
    this._pNav.attach(this._getSubElementId("N"));
    this._pMenus[0].attach(this._getSubElementId("M0"));
    this._pMenus[1].attach(this._getSubElementId("M1"));
    this._pAction.attach(this._getSubElementId("A"));
    this._initMenuContentAnimationHandler(this._getSubElementId("C"));
  }
}

