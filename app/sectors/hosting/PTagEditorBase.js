(function(hstn) {
class PTagEditorBase extends ui.Panel {
  constructor() {
    super();
    this._pName = new ui.PanelWrapper();
  }

  getNamePanel() { return this._pName; }
  getQuickButtonPanel() { return null; }
  getThemePanel() { return null; }
};

hstn.PTagEditorBase = PTagEditorBase;
}(window.hstn = window.hstn || {}));
