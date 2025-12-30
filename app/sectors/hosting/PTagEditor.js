
const _CPT_TAG_EDITOR = {
  MAIN : `<div id="__ID_NAME__"></div>
    <div id="__ID_THEME__"></div>`,
}

class PTagEditor extends hstn.PTagEditorBase {
  constructor() {
    super();
    this._pTheme = new ui.PanelWrapper();
  }

  getThemePanel() { return this._pTheme; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pTheme.attach(this._getSubElementId("T"));
  }

  _renderFramework() {
    let s = _CPT_TAG_EDITOR.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_THEME__", this._getSubElementId("T"));
    return s;
  }
};

hstn.PTagEditor = PTagEditor;
}(window.hstn = window.hstn || {}));
