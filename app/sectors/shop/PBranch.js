(function(shop) {
const _CPT_BRANCH = {
  MAIN : `<div class="flex flex-start">
    <div id="__ID_NAME_DECOR__"></div>
    <div id="__ID_NAME__"></div>
  </div>
  <div id="__ID_ADDRESS__"></div>
  <div id="__ID_REGISTERS__"></div>`,
};

class PBranch extends shop.PBranchBase {
  constructor() {
    super();
    this._pNameEditor = new ui.PanelWrapper();
    this._pNameDecor = new ui.Panel();
    this._pAddress = new ui.PanelWrapper();
    this._pRegisters = new ui.PanelWrapper();
  }

  getNameDecorationPanel() { return this._pNameDecor; }
  getNameEditorPanel() { return this._pNameEditor; }
  getAddressPanel() { return this._pAddress; }
  getRegisterListPanel() { return this._pRegisters; }

  _renderFramework() {
    let s = _CPT_BRANCH.MAIN;
    s = s.replace("__ID_NAME_DECOR__", this._getSubElementId("ND"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ADDRESS__", this._getSubElementId("A"));
    s = s.replace("__ID_REGISTERS__", this._getSubElementId("R"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pNameDecor.attach(this._getSubElementId("ND"));
    this._pNameEditor.attach(this._getSubElementId("N"));
    this._pAddress.attach(this._getSubElementId("A"));
    this._pRegisters.attach(this._getSubElementId("R"));
  }
};

shop.PBranch = PBranch;
}(window.shop = window.shop || {}));
