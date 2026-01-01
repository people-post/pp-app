import { PUserInfoBase } from './PUserInfoBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

/*
 * +--------+-----------+
 * |        | NAME      |
 * |  ICON  |-----------|
 * |        | MSG       |
 * +--------+-----------+
 */

const _CPT_USER_INFO_MIDSIZE_ROW = {
  MAIN : `<div class="flex flex-start clickable user-info midsize">
    <div id="__ID_ICON__" class="pad5px"></div>
    <div class="pad5px">
      <div id="__ID_NAME__" class="s-font4"></div>
      <div id="__ID_DESCRIPTION__" class="small-info-text"></div>
    </div>
  </div>`,
}

export class PUserInfoMidsizeRow extends PUserInfoBase {
  constructor() {
    super();
    this._pIcon = new Panel();
    this._pDescription = new Panel();
  }

  getIconPanel() { return this._pIcon; }
  getDescriptionPanel() { return this._pDescription; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pIcon.attach(this._getSubElementId("I"));
    this._pDescription.attach(this._getSubElementId("D"));
  }

  _renderFramework() {
    let s = _CPT_USER_INFO_MIDSIZE_ROW.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    return s;
  }
};
