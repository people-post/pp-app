export class PUserInfoBase extends ui.Panel {
  constructor() {
    super();
    this._pName = new ui.Panel();
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
