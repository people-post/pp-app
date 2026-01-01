import { Fragment } from './Fragment.js';

export const CF_TIME_INPUT = {
  ON_H_CHANGE : Symbol(),
  ON_M_CHANGE : Symbol(),
};

const _CFT_NUMBER_INPUT = {
  INPUT :
      `<input class="inline-short" type="number" id="__ID__" min="0" max="23" step="1", value="__HR__" onchange="javascript:G.action(window.CF_TIME_INPUT.ON_H_CHANGE, this.value)">:
    <input class="inline-short" type="number" id="__ID__" min="0" max="59" step="1", value="__MINUTE__" onchange="javascript:G.action(window.CF_TIME_INPUT.ON_M_CHANGE, this.value)">`,
};

export class FTimeInput extends Fragment {
  #date;

  constructor() {
    super();
    this.#date = new Date();
  }

  getValue() { return this.#date; }

  setTime(h, m, s) {
    this.#date.setHours(h);
    this.#date.setMinutes(m);
    this.#date.setSeconds(s);
  }

  action(type, ...args) {
    switch (type) {
    case CF_TIME_INPUT.ON_H_CHANGE:
      this.#date.setHours(args[0]);
      break;
    case CF_TIME_INPUT.ON_M_CHANGE:
      this.#date.setMinutes(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let s = _CFT_NUMBER_INPUT.INPUT;
    s = s.replace("__HR__", this.#date.getHours());
    s = s.replace("__MINUTE__", this.#date.getMinutes());
    render.replaceContent(s);
  }
}
