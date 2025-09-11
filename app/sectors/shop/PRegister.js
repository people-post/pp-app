(function(shop) {
const _CPT_REGISTER = {
  MAIN : `<div class="flex flex-start">
    <div id="__ID_NAME_DECOR__"></div>
    <div id="__ID_NAME__"></div>
  </div>
  <div id="__ID_TERMINALS__"></div>`,
};

class PRegister extends shop.PRegisterBase {
  constructor() {
    super();
    this._pNameDecor = new ui.Panel();
    this._pNameEditor = new ui.PanelWrapper();
    this._pTerminals = new ui.PanelWrapper();
  }

  getNameDecorationPanel() { return this._pNameDecor; }
  getNameEditorPanel() { return this._pNameEditor; }
  getTerminalListPanel() { return this._pTerminals; }

  _renderFramework() {
    let s = _CPT_REGISTER.MAIN;
    s = s.replace("__ID_NAME_DECOR__", this._getSubElementId("ND"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_TERMINALS__", this._getSubElementId("T"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pNameDecor.attach(this._getSubElementId("ND"));
    this._pNameEditor.attach(this._getSubElementId("N"));
    this._pTerminals.attach(this._getSubElementId("T"));
  }
};

shop.PRegister = PRegister;
}(window.shop = window.shop || {}));
