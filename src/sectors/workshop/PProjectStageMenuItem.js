
const _CPT_PROJECT_STAGE_MENU_ITEM = {
  MAIN : `<div class="flex space-between baseline-align-items">
      <div>
        <span class="small-info-text">Stage:</span>
        <span id="__ID_NAME__" class="small-info-text"></span>
      </div>
      <div id="__ID_CHECKED__"></div>
    </div>`,
}
import { PProjectStageBase } from './PProjectStageBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PProjectStageMenuItem extends PProjectStageBase {
  constructor() {
    super();
    this._pChecked = new Panel();
  }

  setSelected(b) { this._pChecked.replaceContent(b ? "Y" : ""); }
  setEnabled(b) {
    if (b) {
      this._pName.setClassName("info-message");
    } else {
      this._pName.setClassName("small-info-text");
    }
  }

  _renderFramework() {
    let s = _CPT_PROJECT_STAGE_MENU_ITEM.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_CHECKED__", this._getSubElementId("CK"));
    return s;
  }

  _onFrameworkDidAppear() {
    this._pName.attach(this._getSubElementId("N"));
    this._pChecked.attach(this._getSubElementId("CK"));
  }
};
