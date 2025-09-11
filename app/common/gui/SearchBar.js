(function(gui) {
gui.CF_SEARCH_BAR = {
  ON_CLEAR : Symbol(),
  ON_CHANGE : Symbol(),
  ON_KEYDOWN : Symbol(),
};

const _CFT_SEARCH_BAR = {
  SEARCH_ICON : `<span class="inline-block s-icon6">__ICON__</span>`,
  CLEAR_ICON :
      `<span class="inline-block s-icon6 clickable" onclick="javascript:G.action(gui.CF_SEARCH_BAR.ON_CLEAR)">__ICON__</span>`,
  INPUT :
      `<input id="__ID__" class="search-bar bgtransparent __THEME_CLASS_NAMES__" type="text" onchange="javascript:G.action(gui.CF_SEARCH_BAR.ON_CHANGE, this.value)" onkeydown="javascript:G.action(gui.CF_SEARCH_BAR.ON_KEYDOWN, this.value)" value="__VALUE__"/>`,
};

class SearchBar extends ui.Fragment {
  #isFatMode = false;
  #key = null

  getKey() { return this.#key; }

  setKey(key) { this.#key = key; }
  setFatMode(b) { this.#isFatMode = b; }

  action(type, ...args) {
    switch (type) {
    case gui.CF_SEARCH_BAR.ON_CLEAR:
      this.#onClear();
      break;
    case gui.CF_SEARCH_BAR.ON_CHANGE:
      this.#onChange(args[0]);
      break;
    case gui.CF_SEARCH_BAR.ON_KEYDOWN:
      this.#onKeydown(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ui.PanelWrapper();
    if (this.#isFatMode) {
      p.setClassName("search-bar-panel h-pad5px fat");
    } else {
      p.setClassName("search-bar-panel h-pad5px");
    }
    render.wrapPanel(p);

    let pp = new ui.ListPanel();
    if (this.isMenuRenderMode()) {
      pp.setClassName("search-bar flex s-cprimedecorbd");
    } else {
      pp.setClassName("search-bar flex s-csecondarydecorbd");
    }
    p.wrapPanel(pp);

    let ppp = new ui.Panel();
    ppp.setClassName("left-pad5px flex center-align-items");
    pp.pushPanel(ppp);
    let s = _CFT_SEARCH_BAR.SEARCH_ICON;
    if (this.isMenuRenderMode()) {
      s = s.replace("__ICON__", Utilities.renderSvgMenuIcon(C.ICON.SEARCH));
    } else {
      s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(C.ICON.SEARCH));
    }
    ppp.replaceContent(s);

    ppp = new ui.Panel();
    ppp.setClassName("flex-grow");
    pp.pushPanel(ppp);
    s = _CFT_SEARCH_BAR.INPUT;
    if (this.isMenuRenderMode()) {
      s = s.replace("__THEME_CLASS_NAMES__", "s-cmenu");
    } else {
      s = s.replace("__THEME_CLASS_NAMES__", "");
    }
    s = s.replace("__VALUE__", this.#key ? this.#key : "");
    s = s.replace("__ID__", this.#getInputElementId());
    ppp.replaceContent(s);

    ppp = new ui.Panel();
    ppp.setClassName("right-pad5px flex center-align-items");
    pp.pushPanel(ppp);
    s = _CFT_SEARCH_BAR.CLEAR_ICON;
    if (this.isMenuRenderMode()) {
      s = s.replace("__ICON__", Utilities.renderSvgMenuIcon(ui.ICONS.CLOSE));
    } else {
      s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ui.ICONS.CLOSE));
    }
    ppp.replaceContent(s);
  }

  #getInputElementId() { return "EID_" + this._id; }
  #getInputElement() {
    return document.getElementById(this.#getInputElementId());
  }

  #onChange(value) {}

  #onKeydown(value) {
    if (this.#isSendEvt(event)) {
      this.#key = value;
      this._delegate.onGuiSearchBarRequestSearch(this, value);
    }
  }

  #isSendEvt(evt) { return !evt.shiftKey && evt.key === "Enter"; }

  #onClear() {
    this.#key = null;
    let e = this.#getInputElement();
    if (e) {
      e.value = "";
    }
  }
};

gui.SearchBar = SearchBar;
}(window.gui = window.gui || {}));
