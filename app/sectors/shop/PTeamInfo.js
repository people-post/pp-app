
const _CPT_TEAM_INFO = {
  MAIN :
      `<div id="__ID_MAIN__" class="pad5px bd-b-solid bdlightgray bd1px clickable">
  <div class="flex space-between">
    <div id="__ID_NAME__"></div>
    <div id="__ID_STATUS__"></div>
  </div>
  </div>`,
};
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PTeamInfo extends Panel {
  constructor() {
    super();
    this._pName = new Panel();
    this._pStatus = new Panel();
  }

  isHighlightable() { return true; }

  getNamePanel() { return this._pName; }
  getStatusPanel() { return this._pStatus; }

  highlight() {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = e.className.replace("bdlightgray", "s-cprimebd");
    }
  }

  _renderFramework() {
    let s = _CPT_TEAM_INFO.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pStatus.attach(this._getSubElementId("S"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PTeamInfo = PTeamInfo;
}
