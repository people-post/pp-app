(function(wksp) {
class PProjectInfoBase extends ui.Panel {
  // TODO: Extend from PQuotableBase
  constructor() {
    super();
    this._pTitle = new ui.Panel();
    this._pContent = new ui.Panel();
    this._pImage = new ui.PanelWrapper();
    this._pProgress = new ui.PanelWrapper();
  }

  isColorInvertible() { return false; }

  getImagePanel() { return this._pImage; }
  getTitlePanel() { return this._pTitle; }
  getContentPanel() { return this._pContent; }
  getProgressPanel() { return this._pProgress; }
  getUserIconPanel() { return null; }
  getUserNamePanel() { return null; }
  getReferencePanel() { return null; }
  getCreationTimeSmartPanel() { return null; }
  getSocialBarPanel() { return null; }
  getProgressDirection() { return "H"; }

  setVisibilityClassName(name) {}
  enableImage() {}
  invertColor() {}
};

wksp.PProjectInfoBase = PProjectInfoBase;
}(window.wksp = window.wksp || {}));
