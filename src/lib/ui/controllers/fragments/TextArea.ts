import { SimpleInput } from './SimpleInput.js';

export const CF_TEXT_AREA = {
  ON_CHANGE : "CF_TEXT_AREA_1",
} as const;

// Export to window for string template access
declare global {
  interface Window {
    CF_TEXT_AREA?: typeof CF_TEXT_AREA;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_TEXT_AREA = CF_TEXT_AREA;
}

const _CFT_TEXT_AREA = {
  TITLE : `<p class="title">__TITLE__</p>`,
  INPUT :
      `<textarea id="__ID__" class="__CLASS_NAME__" onchange="javascript:G.action(window.CF_TEXT_AREA.ON_CHANGE, this.value)" placeholder="__HINT__">__VALUE__</textarea>`,
} as const;

interface TextAreaConfig {
  title: string;
  hint: string;
  value: string;
  isRequired: boolean;
}

export class TextArea extends SimpleInput {
  protected _config: TextAreaConfig;
  protected _className: string;

  constructor() {
    super();
    this._config = {title : "", hint : "", value : "", isRequired : true};
    this._className = "";
  }

  setClassName(name: string): void { this._className = name; }

  setValue(v: string): void {
    this._config.value = v;
    let e = this._getInputElement() as HTMLTextAreaElement | null;
    if (e) {
      e.value = v;
    }
  }

  validate(): boolean {
    let e = this._getInputElement() as HTMLTextAreaElement | null;
    if (!e) return false;
    if (this._config.isRequired && !e.value) {
      e.style.borderColor = "bgfirebrick";
      return false;
    } else {
      return true;
    }
  }

  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CF_TEXT_AREA.ON_CHANGE:
      this.#onInputChange(args[0]);
      break;
    default:
      break;
    }
  }

  _renderContent(): string {
    let s: string = _CFT_TEXT_AREA.INPUT;
    s = s.replace("__HINT__", this._config.hint);
    s = s.replace("__ID__", this._getInputElementId());
    s = s.replace("__VALUE__", this._config.value ? this._config.value : "");
    s = s.replace("__CLASS_NAME__", this._className);
    if (this._config.title && this._config.title.length) {
      let ss: string = _CFT_TEXT_AREA.TITLE;
      ss = ss.replace("__TITLE__", this._config.title);
      s = ss + s;
    }
    return s;
  }

  #onInputChange(newValue: string): void {
    if (this._delegate && typeof (this._delegate as any).onInputChangeInTextArea === 'function') {
      (this._delegate as any).onInputChangeInTextArea(this, newValue);
    }
  }
}

