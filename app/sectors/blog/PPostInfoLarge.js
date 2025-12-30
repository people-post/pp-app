
/*
 * +---+-------------+
 * |   |             |
 * |   |             |
 * |   |-------------|
 * |   |             |
 * +---+-------------+
 */

const _CPT_POST_INFO_LARGE = {
  MAIN : `<div class="flex flex-start v-pad5px info-panel large">
    <div class="w50px flex-noshrink">
      <div id="__ID_OWNER_ICON__" class="user-icon-column"></div>
    </div>
    <div class="flex-grow no-overflow">
      <div>
        <div id="__ID_USER_REF__" class="crosslink-note"></div>
        <div class="flex space-between">
          <div id="__ID_USER_NAME__"></div>
          <div id="__ID_TIME__" class="small-info-text"></div>
        </div>
        <div class="post-content item-detail-large content">
          <div id="__ID_TITLE__" class="title"></div>
          <div id="__ID_CONTENT__" class="hide-overflow"></div>
        </div>
      </div>
      <div>
        <div id="__ID_ATTACHMENT__"></div>
        <div id="__ID_IMAGE__"></div>
        <div id="__ID_QUOTE__"></div>
        <div id="__ID_SOCIAL__"></div>
      </div>
    </div>
  </div>`,
}

export class PPostInfoLarge extends gui.PPostInfoBase {
  constructor() {
    super();
    this._pOwnerIcon = new ui.PanelWrapper();
    this._pTitle = new ui.Panel();
    this._pContent = new ui.PanelWrapper();
    this._pOwnerName = new ui.PanelWrapper();
    this._pCrossRef = new S.hr.PUserReference();
    this._pTime = new ui.Panel();
    this._pSocial = new ui.PanelWrapper();
    this._pQuote = new ui.PanelWrapper();
    this._pAttachment = new ui.PanelWrapper();
    this._pImage = new ui.PanelWrapper();
  }

  getOwnerIconPanel() { return this._pOwnerIcon; }
  getTitlePanel() { return this._pTitle; }
  getContentPanel() { return this._pContent; }
  getSocialBarPanel() { return this._pSocial; }
  getOwnerNamePanel() { return this._pOwnerName; }
  getCrossRefPanel() { return this._pCrossRef; }
  getCreationTimeSmartPanel() { return this._pTime; }
  getQuotePanel() { return this._pQuote; }
  getAttachmentPanel() { return this._pAttachment; }
  getImagePanel() { return this._pImage; }

  _renderFramework() {
    let s = _CPT_POST_INFO_LARGE.MAIN;
    s = s.replace("__ID_OWNER_ICON__", this._getSubElementId("O"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_ATTACHMENT__", this._getSubElementId("A"));
    s = s.replace("__ID_SOCIAL__", this._getSubElementId("S"));
    s = s.replace("__ID_USER_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_USER_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pOwnerIcon.attach(this._getSubElementId("O"));
    this._pTitle.attach(this._getSubElementId("T"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pAttachment.attach(this._getSubElementId("A"));
    this._pSocial.attach(this._getSubElementId("S"));
    this._pOwnerName.attach(this._getSubElementId("N"));
    this._pCrossRef.attach(this._getSubElementId("R"));
    this._pTime.attach(this._getSubElementId("TM"));
    this._pImage.attach(this._getSubElementId("I"));
    this._pQuote.attach(this._getSubElementId("Q"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PPostInfoLarge = PPostInfoLarge;
}
