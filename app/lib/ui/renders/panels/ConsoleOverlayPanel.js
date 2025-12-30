import { ConsolePanel } from './ConsolePanel.js';
import { NavPanel } from './NavPanel.js';
import { PanelWrapper } from './PanelWrapper.js';

const _CPT_CONSOLE_OVERLAY = {
  MAIN : `<div class="flex h-header flex-center bgtransparent">
    <div class="flex-grow flex-basis50"></div>
    <div id="__ID_HOME_BTN__" class="flex flex-column flex-center handleevent"></div>
    <div class="flex-grow flex-basis50 flex">
      <div id="__ID_NAV_ICON_0__" class="flex flex-column flex-center handleevent relative"></div>
      <div id="__ID_NAV_ICON_1__" class="flex flex-column flex-center handleevent relative"></div>
    </div>
  </div>
  <div class="f-footer">
    <div class="w100 handleevent">
      <div id="__ID_TAB__" class="w100 grid grid5col tab-row"></div>
    </div>
  </div>`,
};

export class ConsoleOverlayPanel extends ConsolePanel {
  constructor() {
    super();
    this._pTab = new NavPanel();
    this._pTab.setRequireLogin(true);
    this._pNavs = [ new PanelWrapper(), new PanelWrapper() ];
  }

  getTabPanel() { return this._pTab; }
  getNavPanel(i) { return this._pNavs[i]; }

  clearNavPanels() { this._pNavs.map(p => p.clear()); }

  _renderFramework() {
    let s = _CPT_CONSOLE_OVERLAY.MAIN;
    s = s.replace("__ID_HOME_BTN__", this._getSubElementId("H"));
    s = s.replace("__ID_TAB__", this._getSubElementId("N"));
    s = s.replace("__ID_NAV_ICON_0__", this._getSubElementId("N0"));
    s = s.replace("__ID_NAV_ICON_1__", this._getSubElementId("N1"));
    return s;
  }

  _onFrameworkDidAppear() {
    this._pHomeBtn.attach(this._getSubElementId("H"));
    this._pTab.attach(this._getSubElementId("N"));
    this._pNavs[0].attach(this._getSubElementId("N0"));
    this._pNavs[1].attach(this._getSubElementId("N1"));
    super._onFrameworkDidAppear();
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.ConsoleOverlayPanel = ConsoleOverlayPanel;
}
