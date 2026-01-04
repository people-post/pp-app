import { SimpleInput } from './SimpleInput.js';

export const CF_TEXT_INPUT = {
  ONCHANGE : Symbol(),
};

// Export to window for string template access
declare global {
  interface Window {
    CF_TEXT_INPUT?: typeof CF_TEXT_INPUT;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_TEXT_INPUT = CF_TEXT_INPUT;
}

const _CFT_TEXT_INPUT = {
  FULL : `<div>
       <p>__TITLE__</p>
       __INPUT__
    </div>`,
  INPUT :
      `<input type="text" id="__ID__" class="__CLASS_NAME__" placeholder="__HINT__" value="__VALUE__" onchange="javascript:G.action(window.CF_TEXT_INPUT.ONCHANGE, this.value)">`
} as const;

interface TextInputConfig {
  title: string;
  hint: string;
  value: string;
  isRequired: boolean;
}

export class TextInput extends SimpleInput {
  protected _config: TextInputConfig;
  protected _className: string;

  constructor() {
    super();
    this._config = {title : "", hint : "", value : "", isRequired : true};
    this._className = "";
  }

  enableEdit(): void {
    let e = this._getInputElement() as HTMLInputElement | null;
    if (e) {
      e.disabled = false;
    }
  }

  disableEdit(): void {
    let e = this._getInputElement() as HTMLInputElement | null;
    if (e) {
      e.disabled = true;
    }
  }

  setClassName(name: string): void { this._className = name; }

  setValue(v: string): void {
    this._config.value = v;
    let e = this._getInputElement() as HTMLInputElement | null;
    if (e) {
      e.value = v;
    }
  }

  action(type: symbol | string, ...args: any[]): void {
    switch (type) {
    case CF_TEXT_INPUT.ONCHANGE:
      if (this._delegate && typeof (this._delegate as any).onInputChangeInTextInputFragment === 'function') {
        (this._delegate as any).onInputChangeInTextInputFragment(this, args[0]);
      }
      break;
    default:
      super.action.apply(this, arguments as any);
    }
  }

  validate(): boolean {
    let e = this._getInputElement() as HTMLInputElement | null;
    if (!e) return false;
    if (this._config.isRequired && !(e.value && e.value.length)) {
      e.style.border = "1px solid coral";
      e.style.borderRadius = "5px";
      return false;
    } else {
      e.style.border = "";
      e.style.borderRadius = "";
      return true;
    }
  }

  _renderContent(): string {
    let s: string = _CFT_TEXT_INPUT.INPUT;
    s = s.replace("__HINT__", this._config.hint);
    s = s.replace("__ID__", this._getInputElementId());
    s = s.replace("__CLASS_NAME__", this._className);
    s = s.replace("__VALUE__", this._config.value ? this._config.value : "");
    if (this._config.title && this._config.title.length) {
      let ss: string = _CFT_TEXT_INPUT.FULL;
      ss = ss.replace("__TITLE__", this._config.title);
      s = ss.replace("__INPUT__", s);
    }
    return s;
  }
}

