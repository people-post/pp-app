import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PBranchBase extends Panel {
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
