import { Fragment } from './Fragment.js';
import { Panel } from '../../renders/panels/Panel.js';

const _CFT_SIMPLE_PROGRESS = {
  BAR :
      `<span class="simple-progress-fg __COLOR__" style="width:__PERCENT__%"></span>`,
  TEXT :
      `<span class="w100 s-font7 bold center-align simple-progress-text">__VALUE__%</span>`,
} as const;

export class SimpleProgress extends Fragment {
  private _percent: number;
  private _threshold: number;
  private _showText: boolean;

  constructor() {
    super();
    this._percent = 0;
    this._threshold = 30;
    this._showText = false;
  }

  setShowText(b: boolean): void { this._showText = b; }
  setValue(value: number): void {
    if (value < 0 || value > 100) {
      return;
    }
    this._percent = Math.floor(value);
  }

  _renderOnRender(render: any): void {
    let p = new Panel();
    p.setClassName("simple-progress-bg");
    render.wrapPanel(p);

    let s: string = _CFT_SIMPLE_PROGRESS.BAR;
    s = s.replace("__PERCENT__", String(this._percent));
    s = s.replace("__COLOR__", this.#getColorClass());
    if (this._showText) {
      let ss: string = _CFT_SIMPLE_PROGRESS.TEXT;
      ss = ss.replace("__VALUE__", String(this._percent));
      s += ss;
    }
    p.replaceContent(s);
  }

  #getColorClass(): string {
    if (this._percent == 100) {
      return "bggreen";
    }

    if (this._percent < this._threshold) {
      return "bgfirebrick";
    }
    return "bgyellow";
  }
}

