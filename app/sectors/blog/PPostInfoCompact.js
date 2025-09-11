(function(blog) {
/*
 * +--------------+---------+
 * |              |         |
 * |    TEXT      |   IMG   |
 * |              |         |
 * +--------------+---------+
 */

const _CPT_POST_INFO_COMPACT = {
  MAIN : `<div id="__ID_WRAPPER__" class="post-info-compact-wrapper">
  <div id="__ID_PIN__"></div>
  <div id="__ID_MAIN__" class="post-info compact relative">
    <div class="h60px hide-overflow flex space-between">
      <div class="w60 flex-grow flex flex-column flex-center">
        <div id="__ID_REF__" class="crosslink-note"></div>
        <div id="__ID_TITLE__" class="u-font1 bold ellipsis"></div>
        <div id="__ID_DATE_TIME__" class="small-info-text"></div>
        <div id="__ID_QUOTE__"></div>
      </div>
      <div id="__ID_IMAGE__"></div>
    </div>
  </div>
  </div>`,
};

class PPostInfoCompact extends gui.PPostInfoBase {
  constructor() {
    super();
    this._pTitle = new ui.PanelWrapper();
    this._pPin = new ui.Panel();
    this._pCrossRef = new S.hr.PUserReference();
    this._pQuote = new ui.PanelWrapper();
    this._pDateTime = new ui.Panel();
    this._pImage = new ui.PanelWrapper();
  }

  isColorInvertible() { return true; }

  getTitlePanel() { return this._pTitle; }
  getPinPanel() { return this._pPin; }
  getCrossRefPanel() { return this._pCrossRef; }
  getQuotePanel() { return this._pQuote; }
  getCreationDateTimePanel() { return this._pDateTime; }
  getImagePanel() { return this._pImage; }

  enableImage() { this._pImage.setClassName("w100px flex-noshrink"); }
  enableQuote() { this._pQuote.setClassName("hmax20px left-pad5 right-pad5"); }

  setVisibilityClassName(name) {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "post-info compact relative " + name;
    }
  }
  invertColor() {
    let e = document.getElementById(this._getSubElementId("W"));
    if (e) {
      e.className = "post-info-compact-wrapper s-cfuncbg s-csecondary";
    }
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pTitle.attach(this._getSubElementId("T"));
    this._pImage.attach(this._getSubElementId("I"));
    this._pPin.attach(this._getSubElementId("P"));
    this._pCrossRef.attach(this._getSubElementId("R"));
    this._pQuote.attach(this._getSubElementId("Q"));
    this._pDateTime.attach(this._getSubElementId("DT"));
  }

  _renderFramework() {
    let s = _CPT_POST_INFO_COMPACT.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_DATE_TIME__", this._getSubElementId("DT"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_PIN__", this._getSubElementId("P"));
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    s = s.replace("__ID_WRAPPER__", this._getSubElementId("W"));
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    return s;
  }
};

blog.PPostInfoCompact = PPostInfoCompact;
}(window.blog = window.blog || {}));
