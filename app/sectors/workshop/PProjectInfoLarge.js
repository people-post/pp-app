
/*
 * +---+-------------+
 * |   |             |
 * |   |             |
 * |   |-------------|
 * |   |             |
 * +---+-------------+
 */

const _CPT_PROJECT_INFO_LARGE = {
  MAIN : `<div class="flex flex-start info-panel large">
    <div class="w50px flex-noshrink">
      <div id="__ID_USER_ICON__" class="user-icon-column"></div>
    </div>
    <div class="flex-grow no-overflow">
      <div id="__ID_REFERENCE__" class="crosslink-note"></div>
      <div class="flex space-between">
        <div id="__ID_USER_NAME__"></div>
        <div id="__ID_TIME__" class="small-info-text"></div>
      </div>
      <div class="item-detail-large">
        <div class="content">
          <div id="__ID_TITLE__" class="title"></div>
          <div id="__ID_PROGRESS__" class="h-progress-wrapper"></div>
          <div id="__ID_CONTENT__" class="detail"></div>
        </div>
      </div>
      <div id="__ID_THUMBNAIL__"></div>
      <div id="__ID_SOCIAL__"></div>
    </div>
  </div>`,
}

class PProjectInfoLarge extends wksp.PProjectInfoBase {
  constructor() {
    super();
    this._pUserName = new ui.PanelWrapper();
    this._pUserIcon = new ui.PanelWrapper();
    this._pReference = new ui.PanelWrapper();
    this._pTime = new ui.Panel();
    this._pSocial = new ui.PanelWrapper();
  }

  getUserIconPanel() { return this._pUserIcon; }
  getUserNamePanel() { return this._pUserName; }
  getReferencePanel() { return this._pReference; }
  getCreationTimeSmartPanel() { return this._pTime; }
  getSocialBarPanel() { return this._pSocial; }

  _renderFramework() {
    let s = _CPT_PROJECT_INFO_LARGE.MAIN;
    s = s.replace("__ID_USER_ICON__", this._getSubElementId("U"));
    s = s.replace("__ID_REFERENCE__", this._getSubElementId("R"));
    s = s.replace("__ID_USER_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_THUMBNAIL__", this._getSubElementId("I"));
    s = s.replace("__ID_PROGRESS__", this._getSubElementId("P"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_SOCIAL__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pImage.attach(this._getSubElementId("I"));
    this._pTitle.attach(this._getSubElementId("TT"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pProgress.attach(this._getSubElementId("P"));
    this._pUserIcon.attach(this._getSubElementId("U"));
    this._pUserName.attach(this._getSubElementId("N"));
    this._pReference.attach(this._getSubElementId("R"));
    this._pTime.attach(this._getSubElementId("TM"));
    this._pSocial.attach(this._getSubElementId("S"));
  }
};

wksp.PProjectInfoLarge = PProjectInfoLarge;
}(window.wksp = window.wksp || {}));
