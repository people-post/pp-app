
const _CPT_POST_INFO_LARGE_QUOTE = {
  MAIN : `<div class="quote-element pad5px">
  <div id="__ID_REF__" class="crosslink-note"></div>
  <div class="flex space-between">
    <div id="__ID_AUTHOR__"></div>
    <div id="__ID_TIME__" class="small-info-text"></div>
  </div>
  <div class="quote-element-content pad5px">
    <div id="__ID_TITLE__" class="u-font5"></div>
    <div id="__ID_CONTENT__" class="u-font5"></div>
  </div>
  <div id="__ID_IMAGE__"></div>
  </div>`,
}

import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PPostInfoLargeQuote extends PPostInfoBase {
  constructor() {
    super();
    this._pCrossRef = new S.hr.PUserReference();
    this._pAuthorName = new PanelWrapper();
    this._pTitle = new Panel();
    this._pContent = new PanelWrapper();
    this._pTime = new Panel();
    this._pImage = new PanelWrapper();
  }

  getCrossRefPanel() { return this._pCrossRef; }
  getAuthorNamePanel() { return this._pAuthorName; }
  getCreationTimeSmartPanel() { return this._pTime; }
  getTitlePanel() { return this._pTitle; }
  getContentPanel() { return this._pContent; }
  getImagePanel() { return this._pImage; }

  _renderFramework() {
    let s = _CPT_POST_INFO_LARGE_QUOTE.MAIN;
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_AUTHOR__", this._getSubElementId("A"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pCrossRef.attach(this._getSubElementId("R"));
    this._pAuthorName.attach(this._getSubElementId("A"));
    this._pTime.attach(this._getSubElementId("TM"));
    this._pTitle.attach(this._getSubElementId("T"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pImage.attach(this._getSubElementId("I"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PPostInfoLargeQuote = PPostInfoLargeQuote;
}
