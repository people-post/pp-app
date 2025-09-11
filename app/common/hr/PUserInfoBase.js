(function(S) {
S.hr = S.hr || {};
class PUserInfoBase extends ui.Panel {
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

S.hr.PUserInfoBase = PUserInfoBase;
}(window.S = window.S || {}));
