import { Fragment } from './Fragment.js';

export const CF_TIME_INPUT = {
  ON_H_CHANGE : Symbol(),
  ON_M_CHANGE : Symbol(),
};

// Export to window for string template access
declare global {
  interface Window {
    CF_TIME_INPUT?: typeof CF_TIME_INPUT;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_TIME_INPUT = CF_TIME_INPUT;
}

const _CFT_NUMBER_INPUT = {
  INPUT :
      `<input class="inline-short" type="number" id="__ID__" min="0" max="23" step="1", value="__HR__" onchange="javascript:G.action(window.CF_TIME_INPUT.ON_H_CHANGE, this.value)">:
    <input class="inline-short" type="number" id="__ID__" min="0" max="59" step="1", value="__MINUTE__" onchange="javascript:G.action(window.CF_TIME_INPUT.ON_M_CHANGE, this.value)">`,
} as const;

export class FTimeInput extends Fragment {
  #date: Date;

  constructor() {
    super();
    this.#date = new Date();
  }

  getValue(): Date { return this.#date; }

  setTime(h: number, m: number, s: number): void {
    this.#date.setHours(h);
    this.#date.setMinutes(m);
    this.#date.setSeconds(s);
  }

  action(type: symbol | string, ...args: any[]): void {
    switch (type) {
    case CF_TIME_INPUT.ON_H_CHANGE:
      this.#date.setHours(Number(args[0]));
      break;
    case CF_TIME_INPUT.ON_M_CHANGE:
      this.#date.setMinutes(Number(args[0]));
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  _renderOnRender(render: any): void {
    let s: string = _CFT_NUMBER_INPUT.INPUT;
    s = s.replace("__HR__", String(this.#date.getHours()));
    s = s.replace("__MINUTE__", String(this.#date.getMinutes()));
    render.replaceContent(s);
  }
}

