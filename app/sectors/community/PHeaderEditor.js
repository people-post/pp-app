(function(cmut) {
const _CPT_COMMUNITY_HEADER_EDITOR = {
  MAIN : `<div class="aspect-5-1-frame bglightgrey">
    <div id="__ID_BG_IMAGE__" class="aspect-content"></div>
    <div id="__ID_COMMUNITY_ICON__" class="community-icon s-icon2"></div>
    <div id="__ID_BG_UPLOAD__" class="community-bg-image-upload"></div>
  </div>`,
};

class PHeaderEditor extends ui.Panel {
  constructor() {
    super();
    this._pBgImage = new ui.PanelWrapper();
    this._pCommunityIcon = new ui.PanelWrapper();
    this._pBgUpload = new ui.PanelWrapper();
  }

  getBackgroundImagePanel() { return this._pBgImage; }
  getCommunityIconPanel() { return this._pCommunityIcon; }
  getUploadButtonPanel() { return this._pBgUpload; }

  _renderFramework() {
    let s = _CPT_COMMUNITY_HEADER_EDITOR.MAIN;
    s = s.replace("__ID_BG_IMAGE__", this._getSubElementId("B"));
    s = s.replace("__ID_COMMUNITY_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_BG_UPLOAD__", this._getSubElementId("U"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pBgImage.attach(this._getSubElementId("B"));
    this._pCommunityIcon.attach(this._getSubElementId("I"));
    this._pBgUpload.attach(this._getSubElementId("U"));
  }
};

cmut.PHeaderEditor = PHeaderEditor;
}(window.cmut = window.cmut || {}));
