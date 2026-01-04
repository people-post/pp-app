import { Fragment } from './Fragment.js';
import { Utilities } from '../../../../common/Utilities.js';

export const CF_UI_BUTTON = {
  ON_CLICK : Symbol(),
};

// Export to window for string template access
declare global {
  interface Window {
    CF_UI_BUTTON?: typeof CF_UI_BUTTON;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_UI_BUTTON = CF_UI_BUTTON;
}

const _CFT_UI_BUTTON = {
  ACTION : "javascript:G.action(window.CF_UI_BUTTON.ON_CLICK)",
} as const;

interface Theme {
  getPrimaryColor(): string;
  getSecondaryColor(): string;
}

export class Button extends Fragment {
  static LAYOUT_TYPE = {
    SMALL : Symbol(),
    NORMAL: Symbol(),
    BARE: Symbol(),
    BAR: Symbol(),
    LARGE_CYCLE: Symbol(),
  } as const;

  static T_THEME = {
    NONE : Symbol(),
    FUNC: Symbol(),
    RISKY: Symbol(),
    DANGER: Symbol(),
    PALE: Symbol(),
  } as const;

  #name: string = "";
  #icon: string | null = null;
  #value: any = null;
  #theme: Theme | null = null;
  #isEnabled: boolean = true;
  #tTheme: symbol | null = null;
  #tLayout: symbol | null = null;

  getValue(): any { return this.#value; }

  setName(name: string): void { this.#name = name; }
  setIcon(icon: string | null): void { this.#icon = icon; }
  setValue(v: any): void { this.#value = v; }
  setThemeType(type: symbol | null): void { this.#tTheme = type; }
  setTheme(t: Theme | null): void { this.#theme = t; }
  setLayoutType(type: symbol | null): void { this.#tLayout = type; }
  setEnabled(b: boolean): void {
    this.#isEnabled = b;
    this.#updateElement();
  }

  action(type: symbol | string, ..._args: any[]): void {
    switch (type) {
    case CF_UI_BUTTON.ON_CLICK:
      if (this._delegate && typeof (this._delegate as any).onSimpleButtonClicked === 'function') {
        (this._delegate as any).onSimpleButtonClicked(this);
      }
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  enable(): void { this.setEnabled(true); }
  disable(): void { this.setEnabled(false); }

  _renderContent(): string {
    let e: HTMLElement;
    switch (this.#tLayout) {
    case Button.LAYOUT_TYPE.LARGE_CYCLE:
    case Button.LAYOUT_TYPE.SMALL:
    case Button.LAYOUT_TYPE.NORMAL:
    case Button.LAYOUT_TYPE.BARE:
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

  #renderIcon(icon: string): string {
    if (!icon) {
      return "";
    }

    let ss = `<span class="inline-block s-icon6">__ICON__</span>`;
    ss = ss.replace("__ICON__", Utilities.renderSvgFuncIcon(icon, true));
    return ss;
  }

  #updateElement(): void {
    let e = document.getElementById(this.#getBtnId());
    if (e) {
      e.className = this.#getClassName();
      e.setAttribute("onclick", this.#getAction());
    }
  }

  #getAction(): string {
    if (this.#isEnabled) {
      return _CFT_UI_BUTTON.ACTION;
    } else {
      return "javascript:void(0)";
    }
  }

  #getBtnId(): string { return "ID_BTN_" + this._id; }

  #getStyleClassName(isMenuMode: boolean): string {
    return isMenuMode ? this.#getMenuStyleClassName()
                      : this.#getNormalStyleClassName();
  }

  #getClassName(): string {
    let names: string[] = [];
    switch (this.#tLayout) {
    case Button.LAYOUT_TYPE.LARGE_CYCLE:
      names.push("button-like");
      names.push("large-cycle");
      break;
    case Button.LAYOUT_TYPE.SMALL:
      names.push("button-like");
      names.push("small");
      break;
    case Button.LAYOUT_TYPE.NORMAL:
      names.push("button-like");
      names.push("normal");
      break;
    case Button.LAYOUT_TYPE.BARE:
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

  #getMenuStyleClassName(): string {
    if (!this.#isEnabled) {
      return "disabled";
    }
    switch (this.#tTheme) {
    case Button.T_THEME.NONE:
      return "";
    case Button.T_THEME.FUNC:
      return "s-primary s-csecondarybg s-cfunc";
    case Button.T_THEME.RISKY:
      return "cred risky";
    case Button.T_THEME.DANGER:
      return "danger";
    case Button.T_THEME.PALE:
      return "bd1px bdsolid bdlightgray s-cmenu";
    default:
      return "s-cmenubg s-cprime";
    }
  }

  #getNormalStyleClassName(): string {
    if (!this.#isEnabled) {
      return "disabled";
    }
    switch (this.#tTheme) {
    case Button.T_THEME.NONE:
      return "";
    case Button.T_THEME.FUNC:
      return "s-primary s-cfuncbg s-csecondary";
    case Button.T_THEME.RISKY:
      return "cred risky";
    case Button.T_THEME.DANGER:
      return "danger";
    case Button.T_THEME.PALE:
      return "bd1px bdsolid bdlightgray s-cinfotext";
    default:
      return "s-cfuncbg s-csecondary";
    }
  }
}

