(function(S) {
S.hr = S.hr || {};
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

class PUserInfoMidsizeCell extends S.hr.PUserInfoBase {
  constructor() {
    super();
    this._pIcon = new ui.Panel();
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

S.hr.PUserInfoMidsizeCell = PUserInfoMidsizeCell;
}(window.S = window.S || {}));
