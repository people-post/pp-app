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
  MAIN : `<div id="__ID_MAIN__" class="tw-p-[5px] tw-cursor-pointer user-info midsize-cell">
    <div id="__ID_ICON__" class="tw-text-center"></div>
    <div id="__ID_NAME__" class="small-info-text tw-text-center tw-truncate"></div>
  </div>`,
}

export class PUserInfoMidsizeCell extends PUserInfoBase {
  private _pIcon: Panel;

  constructor() {
    super();
    this._pIcon = new Panel();
  }

  getIconPanel(): Panel { return this._pIcon; }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pIcon.attach(this._getSubElementId("I"));
  }

  _renderFramework(): string {
    let s = _CPT_USER_INFO_MIDSIZE_CELL.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    return s;
  }
}

export default PUserInfoMidsizeCell;

