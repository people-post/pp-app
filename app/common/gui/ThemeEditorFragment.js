(function(gui) {
gui.CF_THEME_EDITOR = {
  ON_COLOR_CHANGE : "CF_GUI_THEME_EDITOR_1",
};

const _CFT_THEME_EDITOR = {
  ICON_PREVIEW : `<span class="menu-item-config-name">Icon preview:</span>
    <span class="menu-item-config-icon-preview inline-block s-icon1" style="background-color:__ICON_BG_COLOR__;">
       <img class="photo" src="__SRC__" alt="Icon">
    </span>`,
  COLOR : `<span class="menu-item-config-name">__NAME__:</span>
    <span class="menu-item-config-text-input">
      <input type="text" class="tight-label-like" value="__VALUE__" style="color: __COLOR__;background-color: __BG_COLOR__;" onchange="javascript:G.action(gui.CF_THEME_EDITOR.ON_COLOR_CHANGE, '__KEY__', this.value)">
    </span>`,
};

class ThemeEditorFragment extends ui.Fragment {
  constructor() {
    super();
    this._theme = null;
    this._iconUrl = "";
  }

  setTheme(t) { this._theme = t; }
  setIconUrl(url) { this._iconUrl = url; }

  action(type, ...args) {
    switch (type) {
    case gui.CF_THEME_EDITOR.ON_COLOR_CHANGE:
      this.#onColorChange(args[0], args[1]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderHeaderTheme(this._theme));

    pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderContentTheme(this._theme));

    pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderIconPreview(this._theme, this._iconUrl));
  }

  #onColorChange(key, color) {
    this._delegate.onGuiThemeEditorFragmentRequestChangeColor(this, key, color);
  }

  #renderHeaderTheme(theme) {
    return this.#renderColor("Header", theme.getSecondaryColor(),
                             theme.getPrimaryColor(), "primary");
  }

  #renderContentTheme(theme) {
    return this.#renderColor("Content", theme.getPrimaryColor(),
                             theme.getSecondaryColor(), "secondary");
  }

  #renderColor(name, color, bgColor, key) {
    let s = _CFT_THEME_EDITOR.COLOR;
    s = s.replace("__NAME__", name);
    s = s.replace("__VALUE__", bgColor);
    s = s.replace("__COLOR__", color);
    s = s.replace("__BG_COLOR__", bgColor);
    s = s.replace("__KEY__", key);
    return s;
  }

  #renderIconPreview(theme, iconUrl) {
    let s = _CFT_THEME_EDITOR.ICON_PREVIEW;
    s = s.replace("__SRC__", iconUrl);
    s = s.replace("__ICON_BG_COLOR__", theme.getPrimaryColor());
    return s;
  }
};

gui.ThemeEditorFragment = ThemeEditorFragment;
}(window.gui = window.gui || {}));
