
const _CPT_PROJECT_STAGE = {
  MAIN : `<div id="__ID_NAME__" class="u-font3"></div>
    <div id="__ID_DESCRIPTION__" class="stage-description"></div>
    <div id="__ID_COMMENT__" class="stage-comment"></div>`,
}
import { PProjectStageBase } from './PProjectStageBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProjectStage extends PProjectStageBase {
  constructor() {
    super();
    this._pDescription = new PanelWrapper();
    this._pComment = new PanelWrapper();
  }

  getDescriptionPanel() { return this._pDescription; }
  getCommentPanel() { return this._pComment; }

  _renderFramework() {
    let s = _CPT_PROJECT_STAGE.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_COMMENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    this._pName.attach(this._getSubElementId("N"));
    this._pDescription.attach(this._getSubElementId("D"));
    this._pComment.attach(this._getSubElementId("C"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.PProjectStage = PProjectStage;
}
