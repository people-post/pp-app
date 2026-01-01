
/*
 * +-------+--------------+
 * |       |              |
 * |  IMG  |     TEXT     |
 * |       |              |
 * +-------+--------------+
 */

const _CPT_PROJECT_INFO_SMALL_QUOTE = {
  MAIN : `<div class="aspect-3-1-frame">
  <div class="aspect-content h100 hide-overflow quote-element small flex flex-begin">
    <div id="__ID_PROGRESS__" class="v-progress-wrapper w10px"></div>
    <div id="__ID_IMAGE__"></div>
    <div class="flex-grow pad5px">
      <div class="flex space-between">
        <div id="__ID_USER__"></div>
        <div id="__ID_TIME__" class="small-info-text"></div>
      </div>
      <div id="__ID_TITLE__" class="u-font5"></div>
      <div id="__ID_CONTENT__" class="u-font5"></div>
    </div>
  </div>
  </div>`,
}

import { PProjectInfoBase } from './PProjectInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PProjectInfoSmallQuote extends PProjectInfoBase {
  constructor() {
    super();
    this._pUserName = new PanelWrapper();
    this._pTime = new Panel();
  }

  getProgressDirection() { return "V"; }

  getUserNamePanel() { return this._pUserName; }
  getCreationTimeSmartPanel() { return this._pTime; }

  enableImage() {
    this._pImage.setClassName(
        "quote-element-image-thumbnail-wrapper flex-noshrink");
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pUserName.attach(this._getSubElementId("U"));
    this._pTime.attach(this._getSubElementId("TM"));
    this._pTitle.attach(this._getSubElementId("TT"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pImage.attach(this._getSubElementId("I"));
    this._pProgress.attach(this._getSubElementId("P"));
  }

  _renderFramework() {
    let s = _CPT_PROJECT_INFO_SMALL_QUOTE.MAIN;
    s = s.replace("__ID_USER__", this._getSubElementId("U"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_PROGRESS__", this._getSubElementId("P"));
    return s;
  }
};
