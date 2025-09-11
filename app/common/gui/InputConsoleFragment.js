(function(gui) {
gui.CF_INPUT_CONSOLE = {
  ON_KEY_DOWN : "CF_GUI_INPUT_CONSOLE_1",
  ON_KEY_UP : "CF_GUI_INPUT_CONSOLE_2",
  ON_POST : "CF_GUI_INPUT_CONSOLE_3",
  TOGGLE_MORE : "CF_GUI_INPUT_CONSOLE_4",
}

const _CFT_INPUT_CONSOLE = {
  TEXT_INPUT_NORMAL :
      `<textarea id="ID_INPUT_CONSOLE___FID__" class="console-text" onkeydown="javascript:G.action(gui.CF_INPUT_CONSOLE.ON_KEY_DOWN)" onkeyup="javascript:G.action(gui.CF_INPUT_CONSOLE.ON_KEY_UP)" placeholder="__TEXT_PLACE_HOLDER__">__VALUE__</textarea>`,
  TEXT_INPUT_DISABLED :
      `<textarea class="console-text" placeholder="__TEXT_PLACE_HOLDER__" disabled></textarea>`,
  ICON : `<span class="inline-block s-icon6 clickable">__ICON__</span>`,
  BTN_IMG : `<label class="s-font5" for="_ID_INPUT_CONSOLE_IMG_INPUT">
      <span class="inline-block s-icon3 clickable">__IMG_ICON__</span>
    </label>
    <input id="_ID_INPUT_CONSOLE_IMG_INPUT" type="file" style="display:none" onchange="javascript:G.action(gui.CF_INPUT_CONSOLE.ON_POST_FILE, this)">`,
  BTN_IMG_DISABLED : `<label class="s-font5">
    <span class="inline-block s-icon3 clickable">__IMG_ICON__</span>
   </label>`,
}

class InputConsoleFragment extends ui.Fragment {
  constructor() {
    super();
    this._isVisible = true;
    this._isEnabled = true;
    this._placeholder = "";
    this._cacheText = "";
    this._lastKeyDownEvent = null;
    this._isMenuOpen = false;
  }

  isVisible() { return this._isVisible; }
  isEnabled() { return this._isEnabled; }
  setPlaceholder(text) { this._placeholder = text; }
  setEnabled(b) { this._isEnabled = b; }
  setVisible(b) { this._isVisible = b; }
  setMenuFragment(f) { this.setChild("menu", f); }

  action(type, ...args) {
    switch (type) {
    case gui.CF_INPUT_CONSOLE.ON_KEY_DOWN:
      this.#onKeyDown();
      break;
    case gui.CF_INPUT_CONSOLE.ON_KEY_UP:
      this.#onKeyUp();
      break;
    case gui.CF_INPUT_CONSOLE.ON_POST:
      this.#onPost();
      break;
    case gui.CF_INPUT_CONSOLE.TOGGLE_MORE:
      this.#toggleMoreMenu();
      break;
    case gui.CF_INPUT_CONSOLE.ON_POST_FILE:
      this.#onPostFile(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  setText(text) {
    this._cacheText = text;
    let e = this.#getTextInputNode();
    if (e) {
      e.value = text;
    }
  }

  clearInputText() { this.setText(""); }

  toggleVisibility() {
    if (this._isVisible) {
      this._cacheText = this.#getInputText();
    }
    this._isVisible = !this._isVisible;
    this.render();
  }

  _renderOnRender(render) {
    if (!this._isVisible) {
      render.replaceContent("");
      return;
    }
    let pAll = new ui.ListPanel();
    render.wrapPanel(pAll);
    let p = new ui.ListPanel();
    p.setClassName("input-console");
    pAll.pushPanel(p);
    let pp = new ui.Panel();
    pp.setClassName("input-console-text");
    p.pushPanel(pp);
    pp.replaceContent(this.#renderTextInput(this._isEnabled));
    // Send btn
    pp = new ui.Panel();
    if (this._isEnabled) {
      pp.setAttribute("onclick",
                      "javascript:G.action(gui.CF_INPUT_CONSOLE.ON_POST)");
    }
    p.pushPanel(pp);
    pp.setClassName("input-console-icon");
    pp.replaceContent(this.#renderSendButton());

    // More btn
    let fMenu = this._getChild("menu");
    if (fMenu) {
      pp = new ui.Panel();
      if (this._isMenuOpen) {
        pp.setClassName("input-console-icon s-cprimebg");
      } else {
        pp.setClassName("input-console-icon");
      }
      if (this._isEnabled) {
        pp.setAttribute(
            "onclick", "javascript:G.action(gui.CF_INPUT_CONSOLE.TOGGLE_MORE)");
      }
      p.pushPanel(pp);
      pp.replaceContent(this.#renderMoreButton());
      if (this._isMenuOpen) {
        p = new ui.PanelWrapper();
        p.setClassName("input-console-menu");
        pAll.pushPanel(p);
        fMenu.attachRender(p);
        fMenu.render();
      }
    }
  }

  #renderTextInput(isEnabled) {
    let s;
    if (isEnabled) {
      s = _CFT_INPUT_CONSOLE.TEXT_INPUT_NORMAL;
      s = s.replace("__FID__", this._id);
      s = s.replace("__VALUE__", this._cacheText);
    } else {
      s = _CFT_INPUT_CONSOLE.TEXT_INPUT_DISABLED;
    }
    s = s.replace("__TEXT_PLACE_HOLDER__", this._placeholder);
    return s;
  }

  #renderSendButton() {
    let s = _CFT_INPUT_CONSOLE.ICON;
    s = s.replace("__ICON__", Utilities.renderSvgIcon(
                                  C.ICON.ENTER, "stkdimgray", "filldimgray"));
    return s;
  }

  #renderMoreButton() {
    let s = _CFT_INPUT_CONSOLE.ICON;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(C.ICON.CIRCLED_MORE,
                                                          this._isMenuOpen));
    return s;
  }

  #getInputText() {
    let e = this.#getTextInputNode();
    return e ? e.value.trim() : "";
  }

  #onKeyDown() {
    this._lastKeyDownEvent = event;
    if (this.#isSendEvt(event)) {
      this.#onPost();
    }
  }

  #onKeyUp() {
    if (this.#isSendEvt(this._lastKeyDownEvent)) {
      this.clearInputText();
    }
  }

  #isSendEvt(evt) { return !evt.shiftKey && evt.key === "Enter"; }

  #onPost() {
    let message = this.#getInputText();
    if (message.length) {
      this.clearInputText();
      this._delegate.onInputConsoleRequestPost(message);
    }
  }

  #toggleMoreMenu() {
    this._isMenuOpen = !this._isMenuOpen;
    this.render();
  }

  #onPostFile(inputNode) {
    this._delegate.onInputConsoleRequestPostFile(inputNode.files[0]);
  }

  #getTextInputNode() {
    return document.getElementById("ID_INPUT_CONSOLE_" + this._id);
  }
};

gui.InputConsoleFragment = InputConsoleFragment;
}(window.gui = window.gui || {}));
