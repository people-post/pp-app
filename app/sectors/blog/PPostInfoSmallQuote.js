(function(blog) {
/*
 * +-------+--------------+
 * |       |              |
 * |  IMG  |     TEXT     |
 * |       |              |
 * +-------+--------------+
 */

const _CPT_POST_INFO_SMALL_QUOTE = {
  MAIN : `<div class="aspect-3-1-frame">
  <div class="aspect-content h100 hide-overflow quote-element small flex flex-begin">
    <div id="__ID_IMAGE__"></div>
    <div class="flex-grow pad5px">
      <div id="__ID_REF__" class="crosslink-note"></div>
      <div class="flex space-between">
        <div id="__ID_AUTHOR__"></div>
        <div id="__ID_TIME__" class="small-info-text"></div>
      </div>
      <div id="__ID_TITLE__" class="u-font5"></div>
      <div id="__ID_CONTENT__" class="u-font5"></div>
    </div>
  </div>
  </div>`,
}

class PPostInfoSmallQuote extends gui.PPostInfoBase {
  constructor() {
    super();
    this._pCrossRef = new S.hr.PUserReference();
    this._pAuthorName = new ui.PanelWrapper();
    this._pTime = new ui.Panel();
    this._pTitle = new ui.Panel();
    this._pContent = new ui.PanelWrapper();
    this._pImage = new ui.PanelWrapper();
  }

  getCrossRefPanel() { return this._pCrossRef; }
  getAuthorNamePanel() { return this._pAuthorName; }
  getCreationTimeSmartPanel() { return this._pTime; }
  getTitlePanel() { return this._pTitle; }
  getContentPanel() { return this._pContent; }
  getImagePanel() { return this._pImage; }

  enableImage() {
    this._pImage.setClassName(
        "quote-element-image-thumbnail-wrapper flex-noshrink");
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pCrossRef.attach(this._getSubElementId("R"));
    this._pAuthorName.attach(this._getSubElementId("A"));
    this._pTime.attach(this._getSubElementId("TM"));
    this._pTitle.attach(this._getSubElementId("TT"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pImage.attach(this._getSubElementId("I"));
  }

  _renderFramework() {
    let s = _CPT_POST_INFO_SMALL_QUOTE.MAIN;
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_AUTHOR__", this._getSubElementId("A"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    return s;
  }
};

blog.PPostInfoSmallQuote = PPostInfoSmallQuote;
}(window.blog = window.blog || {}));
