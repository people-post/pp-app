import { Fragment } from './Fragment.js';
import { Panel } from '../../renders/panels/Panel.js';

const _CFT_SIMPLE_PROGRESS = {
  BAR :
      `<span class="simple-progress-fg __COLOR__" style="width:__PERCENT__%"></span>`,
  TEXT :
      `<span class="w100 s-font7 bold center-align simple-progress-text">__VALUE__%</span>`,
}

export class SimpleProgress extends Fragment {
  constructor() {
    super();
    this._percent = 0;
    this._threshold = 30;
    this._showText = false;
  }

  setShowText(b) { this._showText = b; }
  setValue(value) {
    if (value < 0 || value > 100) {
      return;
    }
    this._percent = Math.floor(value);
  }

  _renderOnRender(render) {
    let p = new Panel();
    p.setClassName("simple-progress-bg");
    render.wrapPanel(p);

    let s = _CFT_SIMPLE_PROGRESS.BAR;
    s = s.replace("__PERCENT__", this._percent);
    s = s.replace("__COLOR__", this.#getColorClass());
    if (this._showText) {
      let ss = _CFT_SIMPLE_PROGRESS.TEXT;
      ss = ss.replace("__VALUE__", this._percent);
      s += ss;
    }
    p.replaceContent(s);
  }

  #getColorClass() {
    if (this._percent == 100) {
      return "bggreen";
    }

    if (this._percent < this._threshold) {
      return "bgfirebrick";
    }
    return "bgyellow";
  }
};
