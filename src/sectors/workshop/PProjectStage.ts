
const _CPT_PROJECT_STAGE = {
  MAIN : `<div id="__ID_NAME__" class="u-font3"></div>
    <div id="__ID_DESCRIPTION__"></div>
    <div id="__ID_COMMENT__" class="stage-comment"></div>`,
}
import { PProjectStageBase } from './PProjectStageBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProjectStage extends PProjectStageBase {
  protected _pDescription: PanelWrapper;
  protected _pComment: PanelWrapper;

  constructor() {
    super();
    this._pDescription = new PanelWrapper();
    this._pComment = new PanelWrapper();
  }

  getDescriptionPanel(): PanelWrapper { return this._pDescription; }
  getCommentPanel(): PanelWrapper { return this._pComment; }

  _renderFramework(): string {
    let s = _CPT_PROJECT_STAGE.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_COMMENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    this._pName.attach(this._getSubElementId("N"));
    this._pDescription.attach(this._getSubElementId("D"));
    this._pComment.attach(this._getSubElementId("C"));
  }
}
