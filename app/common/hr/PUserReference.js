(function(S) {
S.hr = S.hr || {};
const _CPT_USER_REFERENCE = {
  MAIN : `<span class="inline-block s-icon5 v-middle-align">__REF_ICON__</span>
    <span id="__ID_TEXT__"></span>
    <span id="__ID_USER__"></span>`,
}

class PUserReference extends ui.Panel {
  constructor() {
    super();
    this._pText = new ui.Panel();
    this._pUser = new ui.PanelWrapper();
  }

  getTextPanel() { return this._pText; }
  getUserPanel() { return this._pUser; }

  _renderFramework() {
    let s = _CPT_USER_REFERENCE.MAIN;
    s = s.replace("__REF_ICON__", Utilities.renderSvgIcon(C.ICON.REFRESH));
    s = s.replace("__ID_TEXT__", this._getSubElementId("T"));
    s = s.replace("__ID_USER__", this._getSubElementId("U"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pText.attach(this._getSubElementId("T"));
    this._pUser.attach(this._getSubElementId("U"));
  }
};

S.hr.PUserReference = PUserReference;
}(window.S = window.S || {}));
