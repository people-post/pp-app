
class PBranchBase extends ui.Panel {
  constructor() { super(); }

  isColorInvertible() { return false; }

  getNameDecorationPanel() { return null; }
  getNamePanel() { return null; }
  getNameEditorPanel() { return null; }
  getAddressPanel() { return null; }
  getRegisterInfoPanel() { return null; }
  getRegisterListPanel() { return null; }

  invertColor() {}
};

shop.PBranchBase = PBranchBase;
}(window.shop = window.shop || {}));
