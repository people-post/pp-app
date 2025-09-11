(function(ui) {
const _CPT_CONSOLE_COL = {
  MAIN : `<div class="sticky-header s-csecondarybg">
    <div class="s-cprimebg h-header flex flex-column space-around">
      <div id="__ID_HOME_BTN__" class="center-align"></div>
    </div>
  </div>
  <div id="__ID_TAB__" class="tab-col"></div>`,
};

class ConsoleColPanel extends ui.ConsolePanel {
  constructor() {
    super();
    this._pTab = new ui.NavPanel();
  }

  getTabPanel() { return this._pTab; }

  _renderFramework() {
    let s = _CPT_CONSOLE_COL.MAIN;
    s = s.replace("__ID_HOME_BTN__", this._getSubElementId("H"));
    s = s.replace("__ID_TAB__", this._getSubElementId("N"));
    return s;
  }

  _onFrameworkDidAppear() {
    this._pHomeBtn.attach(this._getSubElementId("H"));
    this._pTab.attach(this._getSubElementId("N"));
    super._onFrameworkDidAppear();
  }
};

ui.ConsoleColPanel = ConsoleColPanel;
}(window.ui = window.ui || {}));
