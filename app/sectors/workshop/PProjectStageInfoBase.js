
export class PProjectStageInfoBase extends wksp.PProjectStageBase {
  constructor() {
    super();
    this._pOptionBtn = new ui.PanelWrapper();
  }

  getOptionBtnPanel() { return this._pOptionBtn; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.PProjectStageInfoBase = PProjectStageInfoBase;
}
