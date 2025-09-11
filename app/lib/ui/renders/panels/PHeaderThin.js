(function(ui) {
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
};

class PHeaderThin extends ui.PHeader {
  #isNavEnabled = false;

  constructor() {
    super();
    this._pNav = new ui.PanelWrapper();
    this._pMenus =
        [ new ui.PanelWrapper(), new ui.PanelWrapper(), new ui.PanelWrapper() ];
    this._pAction = new ui.PanelWrapper();
    this._pSpace = new ui.Panel();
  }

  getNavPanel() { return this.#isNavEnabled ? this._pNav : null; }
  getMenuPanel(i) { return this._pMenus[i]; }
  getActionPanel() { return this._pAction; }
  getMenuContentElementId() { return this._getSubElementId("C"); }

  setEnableNav(b) { this.#isNavEnabled = b; }

  expandPanelIfPossible(i) {
    let p = this._pMenus[i];
    if (p) {
      p.setClassName("flex flex-column flex-center flex-grow");
      this._pSpace.setClassName("");
    }
  }

  _renderFramework() {
    let s = _CPT_HEADER_THIN.MAIN;
    s = s.replace("__ID_NAV__", this._getSubElementId("N"));
    s = s.replace("__ID_MENU_0__", this._getSubElementId("M0"));
    s = s.replace("__ID_MENU_1__", this._getSubElementId("M1"));
    s = s.replace("__ID_MENU_2__", this._getSubElementId("M2"));
    s = s.replace("__ID_SPACE__", this._getSubElementId("S"));
    s = s.replace("__ID_ACTION__", this._getSubElementId("A"));
    s = s.replace("__ID_MENU_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    this._pNav.attach(this._getSubElementId("N"));
    this._pMenus[0].attach(this._getSubElementId("M0"));
    this._pMenus[1].attach(this._getSubElementId("M1"));
    this._pMenus[2].attach(this._getSubElementId("M2"));
    this._pSpace.attach(this._getSubElementId("S"));
    this._pAction.attach(this._getSubElementId("A"));
    this._initMenuContentAnimationHandler(this._getSubElementId("C"));
  }
};

ui.PHeaderThin = PHeaderThin;
}(window.ui = window.ui || {}));
