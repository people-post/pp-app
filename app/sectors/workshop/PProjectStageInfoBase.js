(function(wksp) {
class PProjectStageInfoBase extends wksp.PProjectStageBase {
  constructor() {
    super();
    this._pOptionBtn = new ui.PanelWrapper();
  }

  getOptionBtnPanel() { return this._pOptionBtn; }
};

wksp.PProjectStageInfoBase = PProjectStageInfoBase;
}(window.wksp = window.wksp || {}));
