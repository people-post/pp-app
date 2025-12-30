
export class PRegisterBase extends ui.Panel {
  constructor() { super(); }

  isColorInvertible() { return false; }

  getNameDecorationPanel() { return null; }
  getNamePanel() { return null; }
  getNameEditorPanel() { return null; }
  getTerminalInfoPanel() { return null; }
  getTerminalListPanel() { return null; }

  invertColor() {}
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PRegisterBase = PRegisterBase;
}
