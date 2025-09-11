(function(ui) {
ui.CL_CONTEXT = {
  CLOSE : Symbol(),
};

const _CLT_CONTEXT = {
  MAIN : `<div id="__ID_TITLE__" class="s-font3"></div>
  <div id="__ID_DESCRIPTION__" class="s-font4"></div>
  <br>
  <div id="__ID_CONTENT__" class="hmax300px y-scroll no-scrollbar"></div>
  <br>
  <div id="__ID_BTN_CANCEL__"></div>`,
};

class PContextLayer extends ui.Panel {
  #pTitle;
  #pDescription;
  #pContent;
  #btnCancel;

  constructor() {
    super();
    this.#pTitle = new ui.Panel();
    this.#pDescription = new ui.Panel();
    this.#pContent = new ui.ListPanel();
    this.#btnCancel = new ui.PanelWrapper();
  }

  getTitlePanel() { return this.#pTitle; }
  getDescriptionPanel() { return this.#pDescription; }
  getContentPanel() { return this.#pContent; }
  getBtnCancelPanel() { return this.#btnCancel; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pDescription.attach(this._getSubElementId("D"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#btnCancel.attach(this._getSubElementId("B"));
  }

  _renderFramework() {
    let s = _CLT_CONTEXT.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_BTN_CANCEL__", this._getSubElementId("B"));
    return s;
  }
};

const _CL_CONTEXT = {
  TITLE : `__TITLE__:`,
};

class LContext extends ui.Layer {
  constructor() {
    super();
    this._title = null;
    this._description = null;
    this._fOptions = new ui.FFragmentList();
    this.setChild("options", this._fOptions);

    this._fCancel = new ui.Button();
    this._fCancel.setThemeType(ui.Button.T_THEME.PALE);
    this._fCancel.setName("Cancel");
    this._fCancel.setDelegate(this);
    this.setChild("btnCancel", this._fCancel);
  }

  setTargetName(name) {
    if (name && name.length) {
      this._title = "Options for " + name;
    } else {
      this._title = null;
    }
  }
  setDescription(d) { this._description = d; }

  addOption(name, value, icon = null, themeType = null) {
    let f = new ui.Button();
    f.setName(name);
    f.setIcon(icon);
    f.setValue(value);
    f.setThemeType(themeType);
    f.setDelegate(this);
    this._fOptions.append(f);
  }

  addOptionFragment(f) { this._fOptions.append(f); }

  // These are hacks, should have more generic structure for fragment protocols
  onRemoteErrorInFragment(f, e) {
    console.log("onRemoteErrorInFragment not implemented in LContext");
    console.log(e);
  }
  onLocalErrorInFragment(f, msg) {
    console.log("onLocalErrorInFragment not implemented in LContext");
    console.log(msg);
  }
  onFragmentRequestShowView(f, view, title) {
    console.log("onFragmentRequestShowView not implemented in LContext");
  }

  clearOptions() { this._fOptions.clear(); }

  dismiss() {
    if (this._owner) {
      this._owner.onRequestPopLayer(this);
    }
  }

  onSimpleButtonClicked(fBtn) {
    this.#onClose();
    if (fBtn != this._fCancel) {
      this._delegate.onOptionClickedInContextLayer(this, fBtn.getValue());
    }
  }

  _renderOnRender(render) {
    // Animate when render for the first time, this might be a hack
    let shouldAnimate = !render.getContentPanel();

    let panel = new ui.PanelWrapper();
    panel.setClassName("w100 h100 context-layer flex flex-column flex-end");
    panel.setAttribute("onclick", "javascript:G.action(ui.CL_CONTEXT.CLOSE)");
    render.wrapPanel(panel);

    let p = new ui.PanelWrapper();
    p.setClassName("w100 flex flex-center relative");
    panel.wrapPanel(p);

    panel = new PContextLayer();
    panel.setClassName(
        "w100 s-csecondarybg bdlightgray border-box context-content");
    panel.setAttribute("onclick", "javascript:G.anchorClick()");
    p.wrapPanel(panel);

    p = panel.getTitlePanel();
    p.replaceContent(this.#renderTitle(this._title));

    if (this._description) {
      p = panel.getDescriptionPanel();
      p.replaceContent(this._description);
    }

    // Hack to allow events being recognized in this._fOptions
    p = panel.getContentPanel();
    this._fOptions.attachRender(p);

    for (let f of this._fOptions.getChildren()) {
      let pp = new ui.PanelWrapper();
      p.pushPanel(pp);
      f.attachRender(pp);
      f.render();
      p.pushSpace(1);
    }

    p = panel.getBtnCancelPanel();
    this._fCancel.attachRender(p);
    this._fCancel.render();

    if (shouldAnimate) {
      panel.animate([ {bottom : `-${panel.getHeight()}px`}, {bottom : "0px"} ],
                    {duration : 200, easing : [ "ease-out" ]});
    }
  }

  action(type, ...args) {
    switch (type) {
    case ui.CL_CONTEXT.CLOSE:
      this.#onClose();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  popState(state) {}

  #renderTitle(title) {
    let s = _CL_CONTEXT.TITLE;
    if (title && title.length) {
      s = s.replace("__TITLE__", title);
    } else {
      s = s.replace("__TITLE__", "Options");
    }
    return s;
  }
  #onClose() { this.dismiss(); }
}

ui.LContext = LContext;
}(window.ui = window.ui || {}));
