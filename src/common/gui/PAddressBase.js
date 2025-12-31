import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PAddressBase extends Panel {
  getNicknamePanel() { return null; }
  getNamePanel() { return null; }
  getCountryPanel() { return null; }
  getStatePanel() { return null; }
  getCityPanel() { return null; }
  getZipcodePanel() { return null; }
  getLine1Panel() { return null; }
  getLine2Panel() { return null; }
  getEditBtnPanel() { return null; }
  getDeleteBtnPanel() { return null; }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.PAddressBase = PAddressBase;
}
