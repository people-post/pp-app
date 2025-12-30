
export class PBranchBase extends ui.Panel {
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PBranchBase = PBranchBase;
}
