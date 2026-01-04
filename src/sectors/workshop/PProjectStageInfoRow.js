
const _CPT_PROJECT_STAGE_INFO_ROW = {
  MAIN : `<div class="flex space-between story-event-info pad5px bdlightgray">
    <div id="__ID_NAME__" class="s-font4"></div>
    <div id="__ID_ACTION__"></div>
  </div>`,
}

import { PProjectStageInfoBase } from './PProjectStageInfoBase.js';

export class PProjectStageInfoRow extends PProjectStageInfoBase {
  _renderFramework() {
    let s = _CPT_PROJECT_STAGE_INFO_ROW.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ACTION__", this._getSubElementId("A"));
    return s;
  }

  _onFrameworkDidAppear() {
    this._pName.attach(this._getSubElementId("N"));
    this._pOptionBtn.attach(this._getSubElementId("A"));
  }
};
