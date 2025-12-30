import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PUserInfoBase extends Panel {
  constructor() {
    super();
    this._pName = new Panel();
  }

  getNamePanel() { return this._pName; }
  getTypeIconPanel() { return null; }
  getUserIdPanel() { return null; }
  getIconPanel() { return null; }
  getDescriptionPanel() { return null; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.S = window.S || {};
  window.S.hr = window.S.hr || {};
  window.S.hr.PUserInfoBase = PUserInfoBase;
}
