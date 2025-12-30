
/*
 * +------------+----------------------+
 * |            |                      |
 * |            |     DETAIL           |
 * |    IMG     |                      |
 * | (OPTIONAL) +----------------------+
 * |            |    SOCIAL(optional)  |
 * +------------+----------------------+
 */

const _CPT_POST_INFO_MIDDLE = {
  MAIN : `<div id="__ID_WRAPPER__" class="post-info-wrapper">
  <div id="__ID_PIN__"></div>
  <div id="__ID_MAIN__" class="shadow-post-info">
    <div class="aspect-3-1-frame">
      <div class="aspect-content h100 flex flex-center">
        <div id="__ID_THUMBNAIL__"></div>
        <div class="flex-grow flex flex-column">
          <div class="flex-grow hide-overflow post-info-right">
            <div id="__ID_REF__" class="crosslink-note"></div>
            <div id="__ID_TEXT__" class="content">
              <div id="__ID_TITLE__" class="title"></div>
              <div id="__ID_CONTENT__" class="u-font5"></div>
            </div>
            <div id="__ID_QUOTE__"></div>
          </div>
          <div id="__ID_SOCIAL__"></div>
        </div>
      </div>
    </div>
  </div>
  </div>`,
}

class PPostInfoMiddle extends gui.PPostInfoBase {
  constructor() {
    super();
    this._pImage = new ui.PanelWrapper();
    this._pTitle = new ui.Panel();
    this._pContent = new ui.PanelWrapper();
    this._pQuote = new ui.PanelWrapper();
    this._pCrossRef = new S.hr.PUserReference();
    this._pSocial = new ui.PanelWrapper();
    this._pPin = new ui.Panel();
    this._pImage = new ui.PanelWrapper();
  }

  isColorInvertible() { return true; }

  getTitlePanel() { return this._pTitle; }
  getCrossRefPanel() { return this._pCrossRef; }
  getContentPanel() { return this._pContent; }
  getQuotePanel() { return this._pQuote; }
  getPinPanel() { return this._pPin; }
  getSocialBarPanel() { return this._pSocial; }
  getImagePanel() { return this._pImage; }

  enableImage() {
    this._pImage.setClassName(
        "post-info-image-thumbnail-wrapper flex-noshrink");
  }
  enableQuote() {
    // Limit content height
    let e = document.getElementById(this._getSubElementId("TXT"));
    if (e) {
      e.className = "content hmax40px hide-overflow";
    }
    this._pQuote.setClassName("left-pad5 right-pad5");
  }
  setVisibilityClassName(name) {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "shadow-post-info " + name;
    }
  }
  invertColor() {
    let e = document.getElementById(this._getSubElementId("W"));
    if (e) {
      e.className = "post-info-wrapper s-cfuncbg s-csecondary";
    }
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pImage.attach(this._getSubElementId("I"));
    this._pCrossRef.attach(this._getSubElementId("R"));
    this._pTitle.attach(this._getSubElementId("T"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pQuote.attach(this._getSubElementId("Q"));
    this._pSocial.attach(this._getSubElementId("S"));
    this._pPin.attach(this._getSubElementId("P"));
  }

  _renderFramework() {
    let s = _CPT_POST_INFO_MIDDLE.MAIN;
    s = s.replace("__ID_THUMBNAIL__", this._getSubElementId("I"));
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    s = s.replace("__ID_SOCIAL__", this._getSubElementId("S"));
    s = s.replace("__ID_PIN__", this._getSubElementId("P"));
    s = s.replace("__ID_TEXT__", this._getSubElementId("TXT"));
    s = s.replace("__ID_WRAPPER__", this._getSubElementId("W"));
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    return s;
  }
};

blog.PPostInfoMiddle = PPostInfoMiddle;
}(window.blog = window.blog || {}));
