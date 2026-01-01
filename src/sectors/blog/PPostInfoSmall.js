
/*
 * +------------------+-----------+
 * |                  |           |
 * |      TEXT        |    IMG    |
 * |                  |           |
 * +------------------+-----------+
 */

const _CPT_POST_INFO_SMALL = {
  MAIN : `<div id="__ID_WRAPPER__" class="post-info-small-wrapper">
  <div id="__ID_PIN__"></div>
  <div id="__ID_REF__" class="crosslink-note hmin10px"></div>
  <div id="__ID_MAIN__" class="post-info small">
    <div class="aspect-5-1-frame">
      <div class="aspect-content hide-overflow flex space-between">
        <div class="w60 flex-grow">
          <div id="__ID_TITLE__" class="u-font3 bold ellipsis"></div>
          <div id="__ID_CONTENT__" class="u-font6 ellipsis"></div>
          <div id="__ID_QUOTE__"></div>
        </div>
        <div id="__ID_IMAGE__"></div>
      </div>
    </div>
  </div>
  </div>`,
}

import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PUserReference } from '../../common/hr/PUserReference.js';

export class PPostInfoSmall extends PPostInfoBase {
  constructor() {
    super();
    this._pTitle = new Panel();
    this._pContent = new PanelWrapper();
    this._pPin = new Panel();
    this._pCrossRef = new PUserReference();
    this._pQuote = new PanelWrapper();
    this._pImage = new PanelWrapper();
  }

  isColorInvertible() { return true; }

  getTitlePanel() { return this._pTitle; }
  getContentPanel() { return this._pContent; }
  getPinPanel() { return this._pPin; }
  getCrossRefPanel() { return this._pCrossRef; }
  getQuotePanel() { return this._pQuote; }
  getImagePanel() { return this._pImage; }

  enableImage() { this._pImage.setClassName("w35 flex-noshrink"); }
  enableQuote() { this._pQuote.setClassName("left-pad5 right-pad5"); }

  setVisibilityClassName(name) {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "post-info small " + name;
    }
  }
  invertColor() {
    let e = document.getElementById(this._getSubElementId("W"));
    if (e) {
      e.className = "post-info-small-wrapper s-cfuncbg s-csecondary";
    }
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pTitle.attach(this._getSubElementId("T"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pImage.attach(this._getSubElementId("I"));
    this._pPin.attach(this._getSubElementId("P"));
    this._pCrossRef.attach(this._getSubElementId("R"));
    this._pQuote.attach(this._getSubElementId("Q"));
  }

  _renderFramework() {
    let s = _CPT_POST_INFO_SMALL.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_PIN__", this._getSubElementId("P"));
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    s = s.replace("__ID_WRAPPER__", this._getSubElementId("W"));
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    return s;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PPostInfoSmall = PPostInfoSmall;
}
