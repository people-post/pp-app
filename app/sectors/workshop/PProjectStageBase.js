
export class PProjectStageBase extends ui.Panel {
  constructor() {
    super();
    this._pName = new ui.Panel();
  }

  getNamePanel() { return this._pName; }
  getDescriptionPanel() { return null; }
  getCommentPanel() { return null; }
  getOptionBtnPanel() { return null; }

  setThemeForState(state, status) {}
  setSelected(b) {}
  setEnabled(b) {}
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.PProjectStageBase = PProjectStageBase;
}
