import { ConsolePanel } from './ConsolePanel.js';
import { NavPanel } from './NavPanel.js';

const _CPT_CONSOLE_COL = {
  MAIN : `<div class="sticky-header s-csecondarybg">
    <div class="s-cprimebg h-header flex flex-column space-around">
      <div id="__ID_HOME_BTN__" class="center-align"></div>
    </div>
  </div>
  <div id="__ID_TAB__" class="tab-col"></div>`,
} as const;

export class ConsoleColPanel extends ConsolePanel {
  declare _pTab: NavPanel;

  constructor() {
    super();
    this._pTab = new NavPanel();
  }

  getTabPanel(): NavPanel { return this._pTab; }

  _renderFramework(): string {
    let s = _CPT_CONSOLE_COL.MAIN;
    s = s.replace("__ID_HOME_BTN__", this._getSubElementId("H"));
    s = s.replace("__ID_TAB__", this._getSubElementId("N"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    this._pHomeBtn.attach(this._getSubElementId("H"));
    this._pTab.attach(this._getSubElementId("N"));
    super._onFrameworkDidAppear();
  }
}

