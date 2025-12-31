import { Fragment } from './Fragment.js';
import { Utilities } from '../../../../common/Utilities.js';

export const CF_UI_BUTTON = {
  ON_CLICK : Symbol(),
};

const _CFT_UI_BUTTON = {
  ACTION : "javascript:G.action(window.CF_UI_BUTTON.ON_CLICK)",
};

export class Button extends Fragment {
  static LAYOUT_TYPE = {
    SMALL : Symbol(),
    NORMAL: Symbol(),
    BARE: Symbol(),
    BAR: Symbol(),
    LARGE_CYCLE: Symbol(),
  };

  static T_THEME = {
    NONE : Symbol(),
    FUNC: Symbol(),
    RISKY: Symbol(),
    DANGER: Symbol(),
    PALE: Symbol(),
  };

  #name = "";
  #icon = null;
  #value = null;
  #theme = null;
  #isEnabled = true;
  #tTheme = null;
  #tLayout = null;

  getValue() { return this.#value; }

  setName(name) { this.#name = name; }
  setIcon(icon) { this.#icon = icon; }
  setValue(v) { this.#value = v; }
  setThemeType(type) { this.#tTheme = type; }
  setTheme(t) { this.#theme = t; }
  setLayoutType(type) { this.#tLayout = type; }
  setEnabled(b) {
    this.#isEnabled = b;
    this.#updateElement();
  }

  action(type, ...args) {
    switch (type) {
    case CF_UI_BUTTON.ON_CLICK:
      this._delegate.onSimpleButtonClicked(this);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  enable() { this.setEnabled(true); }
  disable() { this.setEnabled(false); }

  _renderContent() {
    let e;
    switch (this.#tLayout) {
    case this.constructor.LAYOUT_TYPE.LARGE_CYCLE:
    case this.constructor.LAYOUT_TYPE.SMALL:
    case this.constructor.LAYOUT_TYPE.NORMAL:
    case this.constructor.LAYOUT_TYPE.BARE:
      e = document.createElement("SPAN");
      break;
    default:
      e = document.createElement("A");
      break;
    }
    e.setAttribute("onclick", this.#getAction());
    if (this.#icon) {
      e.innerHTML = this.#renderIcon(this.#icon) + " " + this.#name;
    } else {
      e.innerHTML = this.#name;
    }
    e.className = this.#getClassName();
    if (this.#theme) {
      e.style.backgroundColor = this.#theme.getPrimaryColor();
      e.style.color = this.#theme.getSecondaryColor();
    }
    e.id = this.#getBtnId();
    return e.outerHTML;
  }

  #renderIcon(icon) {
    if (!icon) {
      return "";
    }

    let ss = `<span class="inline-block s-icon6">__ICON__</span>`;
    ss = ss.replace("__ICON__", Utilities.renderSvgFuncIcon(this.#icon, true));
    return ss;
  }

  #updateElement() {
    let e = document.getElementById(this.#getBtnId());
    if (e) {
      e.className = this.#getClassName();
      e.setAttribute("onclick", this.#getAction());
    }
  }

  #getAction() {
    if (this.#isEnabled) {
      return _CFT_UI_BUTTON.ACTION;
    } else {
      return "javascript:void(0)";
    }
  }

  #getBtnId() { return "ID_BTN_" + this._id; }

  #getStyleClassName(isMenuMode) {
    return isMenuMode ? this.#getMenuStyleClassName()
                      : this.#getNormalStyleClassName();
  }

  #getClassName() {
    let names = [];
    switch (this.#tLayout) {
    case this.constructor.LAYOUT_TYPE.LARGE_CYCLE:
      names.push("button-like");
      names.push("large-cycle");
      break;
    case this.constructor.LAYOUT_TYPE.SMALL:
      names.push("button-like");
      names.push("small");
      break;
    case this.constructor.LAYOUT_TYPE.NORMAL:
      names.push("button-like");
      names.push("normal");
      break;
    case this.constructor.LAYOUT_TYPE.BARE:
      names.push("button-like");
      break;
    default:
      // Legacy default button-bar
      names.push("button-bar");
      break;
    }
    let s = this.#getStyleClassName(this.isMenuRenderMode());
    if (s && s.length) {
      names.push(s);
    }
    return names.join(" ");
  }

  #getMenuStyleClassName() {
    if (!this.#isEnabled) {
      return "disabled";
    }
    switch (this.#tTheme) {
    case this.constructor.T_THEME.NONE:
      return "";
    case this.constructor.T_THEME.FUNC:
      return "s-primary s-csecondarybg s-cfunc";
    case this.constructor.T_THEME.RISKY:
      return "cred risky";
    case this.constructor.T_THEME.DANGER:
      return "danger";
    case this.constructor.T_THEME.PALE:
      return "bd1px bdsolid bdlightgray s-cmenu";
    default:
      return "s-cmenubg s-cprime";
    }
  }

  #getNormalStyleClassName() {
    if (!this.#isEnabled) {
      return "disabled";
    }
    switch (this.#tTheme) {
    case this.constructor.T_THEME.NONE:
      return "";
    case this.constructor.T_THEME.FUNC:
      return "s-primary s-cfuncbg s-csecondary";
    case this.constructor.T_THEME.RISKY:
      return "cred risky";
    case this.constructor.T_THEME.DANGER:
      return "danger";
    case this.constructor.T_THEME.PALE:
      return "bd1px bdsolid bdlightgray s-cinfotext";
    default:
      return "s-cfuncbg s-csecondary";
    }
  }
};

