(function(S) {
S.hr = S.hr || {};
/*
 * +--------+-----------+
 * |  ICON  | NAME      |
 * +--------+-----------+
 */

const _CPT_USER_INFO_SMALL_ROW = {
  MAIN :
      `<div class="flex flex-start center-align-items clickable left-pad5 user-info small">
    <div id="__ID_ICON__"></div>
    <div id="__ID_NAME__" class="s-font4"></div>
  </div>`,
}

class PUserInfoSmallRow extends S.hr.PUserInfoBase {
  constructor() {
    super();
    this._pIcon = new ui.PanelWrapper();
  }

  getIconPanel() { return this._pIcon; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pIcon.attach(this._getSubElementId("I"));
  }

  _renderFramework() {
    let s = _CPT_USER_INFO_SMALL_ROW.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    return s;
  }
};

S.hr.PUserInfoSmallRow = PUserInfoSmallRow;
}(window.S = window.S || {}));
