
/*
 * +--------------+
 * |              |
 * |     IMG      |
 * |              |
 * +--------------+
 * |     TEXT     |
 * +--------------+
 */

const _CPT_POST_INFO_HUGE = {
  MAIN : `<div class="post-info huge">
  <div id="__ID_IMAGE__"></div>
  <div class="aspect-5-1-frame">
    <div class="aspect-content hide-overflow">
      <div id="__ID_REF__" class="crosslink-note"></div>
      <div id="__ID_TITLE__" class="u-font1"></div>
      <div id="__ID_DATE_TIME__" class="small-info-text"></div>
      <div id="__ID_QUOTE__"></div>
    </div>
  </div>
  </div>`,
}

export class PPostInfoHuge extends gui.PPostInfoBase {
  constructor() {
    super();
    this._pTitle = new ui.Panel();
    this._pCrossRef = new S.hr.PUserReference();
    this._pQuote = new ui.PanelWrapper();
    this._pDateTime = new ui.Panel();
    this._pImage = new ui.PanelWrapper();
  }

  getTitlePanel() { return this._pTitle; }
  getPinPanel() { return null; }
  getCrossRefPanel() { return this._pCrossRef; }
  getQuotePanel() { return this._pQuote; }
  getCreationDateTimePanel() { return this._pDateTime; }
  getImagePanel() { return this._pImage; }

  enableQuote() { this._pQuote.setClassName("left-pad5 right-pad5"); }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pTitle.attach(this._getSubElementId("T"));
    this._pImage.attach(this._getSubElementId("I"));
    this._pCrossRef.attach(this._getSubElementId("R"));
    this._pQuote.attach(this._getSubElementId("Q"));
    this._pDateTime.attach(this._getSubElementId("DT"));
  }

  _renderFramework() {
    let s = _CPT_POST_INFO_HUGE.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    s = s.replace("__ID_DATE_TIME__", this._getSubElementId("DT"));
    return s;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PPostInfoHuge = PPostInfoHuge;
}
