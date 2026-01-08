
const _CPT_PROJECT_INFO_LARGE_QUOTE = {
  MAIN : `<div class="quote-element pad5px">
  <div class="flex space-between">
    <div id="__ID_USER__"></div>
    <div id="__ID_TIME__" class="small-info-text"></div>
  </div>
  <div class="quote-element-content pad5px">
    <div id="__ID_TITLE__" class="u-font5"></div>
    <div id="__ID_PROGRESS__" class="h-progress-wrapper"></div>
    <div id="__ID_CONTENT__" class="u-font5"></div>
  </div>
  <div id="__ID_IMAGE__"></div>
  </div>`,
}

import { PProjectInfoBase } from './PProjectInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PProjectInfoLargeQuote extends PProjectInfoBase {
  protected _pUserName: PanelWrapper;
  protected _pTime: Panel;

  constructor() {
    super();
    this._pUserName = new PanelWrapper();
    this._pTime = new Panel();
  }

  getUserNamePanel(): PanelWrapper { return this._pUserName; }
  getCreationTimeSmartPanel(): Panel { return this._pTime; }

  _renderFramework(): string {
    let s = _CPT_PROJECT_INFO_LARGE_QUOTE.MAIN;
    s = s.replace("__ID_USER__", this._getSubElementId("U"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_PROGRESS__", this._getSubElementId("P"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pUserName.attach(this._getSubElementId("U"));
    this._pTime.attach(this._getSubElementId("TM"));
    this._pTitle.attach(this._getSubElementId("T"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pImage.attach(this._getSubElementId("I"));
    this._pProgress.attach(this._getSubElementId("P"));
  }
}
