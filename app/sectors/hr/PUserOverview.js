
const _CPT_USER_OVERVIEW = {
  MAIN : `<div class="aspect-5-1-frame bglightgrey">
    <div id="__ID_BG_IMAGE__" class="aspect-content"></div>
    <div id="__ID_USER_ICON__" class="user-info-header-user-icon s-icon2"></div>
    <div id="__ID_BG_UPLOAD__" class="user-info-header-image-upload"></div>
  </div>`,
};

export class PUserOverview extends ui.Panel {
  constructor() {
    super();
    this._pBgImage = new ui.PanelWrapper();
    this._pUserIcon = new ui.PanelWrapper();
    this._pBgUpload = new ui.PanelWrapper();
  }

  getBackgroundImagePanel() { return this._pBgImage; }
  getUserIconPanel() { return this._pUserIcon; }
  getUploadButtonPanel() { return this._pBgUpload; }

  _renderFramework() {
    let s = _CPT_USER_OVERVIEW.MAIN;
    s = s.replace("__ID_BG_IMAGE__", this._getSubElementId("B"));
    s = s.replace("__ID_USER_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_BG_UPLOAD__", this._getSubElementId("U"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pBgImage.attach(this._getSubElementId("B"));
    this._pUserIcon.attach(this._getSubElementId("I"));
    this._pBgUpload.attach(this._getSubElementId("U"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hr = window.hr || {};
  window.hr.PUserOverview = PUserOverview;
}
