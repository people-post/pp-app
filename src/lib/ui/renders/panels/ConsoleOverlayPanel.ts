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
} as const;

export class ConsoleOverlayPanel extends ConsolePanel {
  declare _pTab: NavPanel;
  declare _pNavs: PanelWrapper[];

  constructor() {
    super();
    this._pTab = new NavPanel();
    this._pTab.setRequireLogin(true);
    this._pNavs = [ new PanelWrapper(), new PanelWrapper() ];
  }

  getTabPanel(): NavPanel { return this._pTab; }
  getNavPanel(i: number): PanelWrapper | null { return this._pNavs[i] ?? null; }

  clearNavPanels(): void { this._pNavs.forEach(p => p.clear()); }

  _renderFramework(): string {
    let s: string = _CPT_CONSOLE_OVERLAY.MAIN;
    s = s.replace("__ID_HOME_BTN__", this._getSubElementId("H")) as string;
    s = s.replace("__ID_TAB__", this._getSubElementId("N")) as string;
    s = s.replace("__ID_NAV_ICON_0__", this._getSubElementId("N0")) as string;
    s = s.replace("__ID_NAV_ICON_1__", this._getSubElementId("N1")) as string;
    return s;
  }

  _onFrameworkDidAppear(): void {
    this._pHomeBtn.attach(this._getSubElementId("H"));
    this._pTab.attach(this._getSubElementId("N"));
    this._pNavs[0].attach(this._getSubElementId("N0"));
    this._pNavs[1].attach(this._getSubElementId("N1"));
    super._onFrameworkDidAppear();
  }
}

