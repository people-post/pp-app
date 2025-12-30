import { PUserInfoBase } from './PUserInfoBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

/*
 * +--------+
 * |        |
 * |  ICON  |
 * |        |
 * +--------+
 * |  NAME  |
 * +--------+
 */

const _CPT_USER_INFO_MIDSIZE_CELL = {
  MAIN : `<div id="__ID_MAIN__" class="pad5px clickable user-info midsize-cell">
    <div id="__ID_ICON__" class="center-align"></div>
    <div id="__ID_NAME__" class="small-info-text center-align ellipsis"></div>
  </div>`,
}

export class PUserInfoMidsizeCell extends PUserInfoBase {
  constructor() {
    super();
    this._pIcon = new Panel();
  }

  getIconPanel() { return this._pIcon; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pIcon.attach(this._getSubElementId("I"));
  }

  _renderFramework() {
    let s = _CPT_USER_INFO_MIDSIZE_CELL.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    return s;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.S = window.S || {};
  window.S.hr = window.S.hr || {};
  window.S.hr.PUserInfoMidsizeCell = PUserInfoMidsizeCell;
}
