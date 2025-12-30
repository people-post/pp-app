
export class PTagEditorBase extends ui.Panel {
  constructor() {
    super();
    this._pName = new ui.PanelWrapper();
  }

  getNamePanel() { return this._pName; }
  getQuickButtonPanel() { return null; }
  getThemePanel() { return null; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hstn = window.hstn || {};
  window.hstn.PTagEditorBase = PTagEditorBase;
}
