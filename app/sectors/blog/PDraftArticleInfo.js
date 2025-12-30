
const _CPT_DRAFT_ARTICLE_INFO = {
  MAIN : `<div id="__ID_WRAPPER__" class="info-panel draft">
    <div class="pad5px u-font5">
      <div class="flex space-between">
        <div id="__ID_AUTHOR__"></div>
        <div id="__ID_TIME__" class="small-info-text"></div>
      </div>
      <div id="__ID_TAGS__"></div>
      <div id="__ID_TITLE__" class="title"></div>
      <div id="__ID_CONTENT__" class="hide-overflow"></div>
    </div>
  </div>`,
};

export class PDraftArticleInfo extends blog.PArticleBase {
  constructor() {
    super();
    this._pAuthorName = new ui.PanelWrapper();
    this._pTags = new ui.PanelWrapper();
    this._pTitle = new ui.Panel();
    this._pContent = new ui.PanelWrapper();
    this._pTime = new ui.Panel();
  }

  getTitlePanel() { return this._pTitle; }
  getContentPanel() { return this._pContent; }
  getOwnerIconPanel() { return null; }
  getOwnerNamePanel() { return null; }
  getAuthorNamePanel() { return this._pAuthorName; }
  getTagsPanel() { return this._pTags; }
  getCreationTimeSmartPanel() { return this._pTime; }
  getCreationDateTimePanel() { return null; }

  invertColor() {
    let e = document.getElementById(this._getSubElementId("W"));
    if (e) {
      e.className = "info-panel draft s-cfuncbg s-csecondary";
    }
  }

  _renderFramework() {
    let s = _CPT_DRAFT_ARTICLE_INFO.MAIN;
    s = s.replace("__ID_WRAPPER__", this._getSubElementId("W"));
    s = s.replace("__ID_AUTHOR__", this._getSubElementId("A"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_TAGS__", this._getSubElementId("TG"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pAuthorName.attach(this._getSubElementId("A"));
    this._pTime.attach(this._getSubElementId("TM"));
    this._pTags.attach(this._getSubElementId("TG"));
    this._pTitle.attach(this._getSubElementId("TT"));
    this._pContent.attach(this._getSubElementId("C"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PDraftArticleInfo = PDraftArticleInfo;
}
