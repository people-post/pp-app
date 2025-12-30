
class FvcTagEditor extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fTagEditor = new hstn.FTagEditor();
    this._fTagEditor.setDelegate(this);
    this.setChild("editor", this._fTagEditor);
  }

  onClickInTagEditorFragment(fTagEditor) {}

  setTagId(id) { this._fTagEditor.setTagId(id); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case fwk.T_DATA.WEB_CONFIG:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    this._fTagEditor.attachRender(render);
    this._fTagEditor.render();
  }
};

hstn.FvcTagEditor = FvcTagEditor;
}(window.hstn = window.hstn || {}));
