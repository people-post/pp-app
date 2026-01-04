import { SimpleInput } from './SimpleInput.js';

export const CF_NUMBER_INPUT = {
  ONCHANGE : "CF_NUMBER_INPUT_1",
} as const;

// Export to window for string template access
declare global {
  interface Window {
    CF_NUMBER_INPUT?: typeof CF_NUMBER_INPUT;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_NUMBER_INPUT = CF_NUMBER_INPUT;
}

const _CFT_NUMBER_INPUT = {
  FULL : `<div>
       <p>__TITLE__</p>
       __INPUT__
    </div>`,
  INPUT :
      `<input class="__CLASS__" type="number" id="__ID__" min="__MIN__" max="__MAX__" step="__STEP__", value="__VALUE__" onchange="javascript:G.action(window.CF_NUMBER_INPUT.ONCHANGE, this.value)">__UNIT__`,
} as const;

interface NumberInputConfig {
  title?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  unit?: string;
}

export class NumberInput extends SimpleInput {
  // Config: {
  // title
  // min
  // max
  // step
  // value
  // unit
  // }
  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CF_NUMBER_INPUT.ONCHANGE:
      if (this._delegate && typeof (this._delegate as any).onInputChangeInNumberInputFragment === 'function') {
        (this._delegate as any).onInputChangeInNumberInputFragment(this, args[0]);
      }
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  validate(): boolean {
    // Range will be automatically checked
    let v = parseInt(this.getValue());
    if (this.#isValueInRange(v)) {
      this._clearErrorMark();
      return true;
    } else {
      this._markError();
      return false;
    }
  }

  _renderContent(): string {
    const config = this._config as NumberInputConfig;
    let s: string = _CFT_NUMBER_INPUT.INPUT;
    s = s.replace("__CLASS__", this._hasError ? "input-error" : "");
    s = s.replace("__ID__", this._getInputElementId());
    s = s.replace("__MIN__", String(config.min ?? ""));
    s = s.replace("__MAX__", String(config.max ?? ""));
    s = s.replace("__STEP__", String(config.step ?? ""));
    s = s.replace("__VALUE__", String(config.value ?? ""));
    s = s.replace("__UNIT__", config.unit ? config.unit : "");
    if (config.title && config.title.length) {
      let ss: string = _CFT_NUMBER_INPUT.FULL;
      ss = ss.replace("__TITLE__", config.title);
      s = ss.replace("__INPUT__", s);
    }
    return s;
  }

  #isValueInRange(v: number): boolean {
    if (isNaN(v)) {
      return false;
    }
    const config = this._config as NumberInputConfig;
    if (config.min !== undefined && v < config.min) {
      return false;
    }
    if (config.max !== undefined && v > config.max) {
      return false;
    }
    return true;
  }
}

