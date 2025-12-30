
const _CPT_TAG_EDITOR_INFO = {
  MAIN :
      `<div class="flex space-between pad5px bdlightgray bd1px bd-b-solid clickable">
    <div id="__ID_NAME__"></div>
    <div id="__ID_QUICK_BTN__"></div>
  </div>`,
}

class PTagEditorInfo extends hstn.PTagEditorBase {
  constructor() {
    super();
    this._pBtnQuick = new ui.PanelWrapper();
  }

  getQuickButtonPanel() { return this._pBtnQuick; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pBtnQuick.attach(this._getSubElementId("Q"));
  }

  _renderFramework() {
    let s = _CPT_TAG_EDITOR_INFO.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_QUICK_BTN__", this._getSubElementId("Q"));
    return s;
  }
};

hstn.PTagEditorInfo = PTagEditorInfo;
}(window.hstn = window.hstn || {}));
