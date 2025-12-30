
class PRegisterBase extends ui.Panel {
  constructor() { super(); }

  isColorInvertible() { return false; }

  getNameDecorationPanel() { return null; }
  getNamePanel() { return null; }
  getNameEditorPanel() { return null; }
  getTerminalInfoPanel() { return null; }
  getTerminalListPanel() { return null; }

  invertColor() {}
};

shop.PRegisterBase = PRegisterBase;
}(window.shop = window.shop || {}));
