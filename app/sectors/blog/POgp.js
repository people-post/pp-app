
export class POgp extends ui.Panel {
  constructor() {
    super();
    this._pAuthor = new ui.PanelWrapper();
    this._pTime = new ui.Panel();
    this._pImage = new ui.PanelWrapper();
    this._pTitle = new ui.Panel();
    this._pDescription = new ui.Panel();
  }

  getAuthorPanel() { return this._pAuthor; }
  getCreationTimeSmartPanel() { return this._pTime; }
  getImagePanel() { return this._pImage; }
  getTitlePanel() { return this._pTitle; }
  getDescriptionPanel() { return this._pDescription; }

  _renderFramework() {
    let s = this._getTemplate();
    s = s.replace("__ID_AUTHOR__", this._getSubElementId("AU"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("IMG"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    this._pAuthor.attach(this._getSubElementId("AU"));
    this._pTime.attach(this._getSubElementId("TM"));
    this._pImage.attach(this._getSubElementId("IMG"));
    this._pTitle.attach(this._getSubElementId("TT"));
    this._pDescription.attach(this._getSubElementId("C"));
  }

  _getTemplate() { return ""; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.POgp = POgp;
}
