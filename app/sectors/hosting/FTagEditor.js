(function(hstn) {
hstn.CF_TAG_EDITOR = {
  ON_CLICK : Symbol(),
}

class FTagEditor extends ui.Fragment {
  static T_LAYOUT = {
    INFO : Symbol(),
  };

  constructor() {
    super();
    this._fBtnQuick = new ui.Button();
    this._fBtnQuick.setName("Rename...");
    this._fBtnQuick.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this._fBtnQuick.setDelegate(this);
    this.setChild("btnQuick", this._fBtnQuick);

    this._fTheme = new gui.ThemeEditorFragment();
    this._fTheme.setDelegate(this);
    this.setChild("theme", this._fTheme);

    this._tagId = null;
    this._tLayout = null;
  }

  getTagId() { return this._tagId; }

  setLayoutType(t) { this._tLayout = t; }
  setTagId(id) { this._tagId = id; }

  onSimpleButtonClicked(fBtn) { this.#onRename(); }
  onGuiThemeEditorFragmentRequestChangeColor(fThemeEditor, key, color) {
    dba.WebConfig.asyncUpdateGroupConfig(this._tagId, null, key, color);
  }

  action(type, ...args) {
    switch (type) {
    case hstn.CF_TAG_EDITOR.ON_CLICK:
      this._delegate.onClickInTagEditorFragment(this);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let tag = dba.WebConfig.getTag(this._tagId);
    if (!tag) {
      return;
    }
    let panel = this.#createPanel();
    render.wrapPanel(panel);
    let p = panel.getNamePanel();
    p.replaceContent(tag.getName());

    p = panel.getThemePanel();
    if (p) {
      let owner = dba.WebConfig.getOwner();
      let iconUrl = owner ? owner.getIconUrl() : "";
      this._fTheme.setIconUrl(iconUrl);
      this._fTheme.setTheme(tag.getTheme() || dba.WebConfig.getDefaultTheme());
      this._fTheme.attachRender(p);
      this._fTheme.render();
    }

    p = panel.getQuickButtonPanel();
    if (p) {
      this._fBtnQuick.attachRender(p);
      this._fBtnQuick.render();
    }
  }

  #createPanel() {
    let p = null;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.INFO:
      p = new hstn.PTagEditorInfo();
      p.setAttribute("onclick", "G.action(hstn.CF_TAG_EDITOR.ON_CLICK)");
      break;
    default:
      p = new hstn.PTagEditor();
      break;
    }
    return p;
  }

  #onRename() {
    let tag = dba.WebConfig.getTag(this._tagId);
    if (!tag) {
      return;
    }
    let v = new ui.View();
    let fvc = new S.hr.FvcUserInput();
    let f = new ui.TextInput();
    f.setConfig({
      title : "Change tag name:",
      hint : "New tag name",
      value : tag.getName(),
      isRequired : true
    });
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate : () => f.validate(),
      fcnOK : () =>
          dba.WebConfig.asyncUpdateGroupConfig(this._tagId, f.getValue()),
    });
    v.setContentFragment(fvc);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Rename",
                                false);
  }
};

hstn.FTagEditor = FTagEditor;
}(window.hstn = window.hstn || {}));
