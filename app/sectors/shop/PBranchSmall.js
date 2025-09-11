(function(shop) {
const _CPT_BRANCH_SMALL = {
  MAIN :
      `<div id="__ID_MAIN__" class="bd-b-solid bd-b-1px bdlightgray clickable">
  <div class="pad5px">
    <div id="__ID_NAME__"></div>
    <div id="__ID_ADDRESS__"></div>
    <div id="__ID_REGISTER_INFO__"></div>
  </div>
  </div>`,
};

class PBranchSmall extends shop.PBranchBase {
  constructor() {
    super();
    this._pName = new ui.Panel();
    this._pAddress = new ui.PanelWrapper();
    this._pRegisterInfo = new ui.Panel();
  }

  isColorInvertible() { return true; }

  getNamePanel() { return this._pName; }
  getAddressPanel() { return this._pAddress; }
  getRegisterInfoPanel() { return this._pRegisterInfo; }

  invertColor() {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = e.className.replace("bdlightgray", "s-cprimebd");
    }
  }

  _renderFramework() {
    let s = _CPT_BRANCH_SMALL.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ADDRESS__", this._getSubElementId("A"));
    s = s.replace("__ID_REGISTER_INFO__", this._getSubElementId("R"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pAddress.attach(this._getSubElementId("A"));
    this._pRegisterInfo.attach(this._getSubElementId("R"));
  }
};

shop.PBranchSmall = PBranchSmall;
}(window.shop = window.shop || {}));
