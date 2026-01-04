import { Fragment } from './Fragment.js';

const _CFT_RICH_PROGRESS = {
  FIRST_NODE_H : `<div class="rpe node horizontal first">
  <div class="rpe-node-content-wrapper">
    <div class="rpe-content node __BG_COLOR_CLS__"></div>
  </div>
  </div>`,
  FIRST_NODE_V : `<div class="rpe node vertical first">
  <div class="rpe-node-content-wrapper">
    <div class="rpe-content node __BG_COLOR_CLS__"></div>
  </div>
  </div>`,
  LAST_NODE_H : `<div class="rpe node horizontal last">
  <div class="rpe-node-content-wrapper">
    <div class="rpe-content node __BG_COLOR_CLS__"></div>
  </div>
  </div>`,
  LAST_NODE_V : `<div class="rpe node vertical last">
  <div class="rpe-node-content-wrapper">
    <div class="rpe-content node __BG_COLOR_CLS__"></div>
  </div>
  </div>`,
  NODE_H : `<div class="rpe node horizontal" style="left:__P_BEGIN__%;">
  <div class="rpe-node-content-wrapper">
    <div class="rpe-content node __BG_COLOR_CLS__"></div>
  </div>
  </div>`,
  NODE_V : `<div class="rpe node vertical" style="bottom:__P_BEGIN__%;">
  <div class="rpe-node-content-wrapper">
    <div class="rpe-content node __BG_COLOR_CLS__"></div>
  </div>
  </div>`,
  PIPE_H :
      `<div class="rpe pipe horizontal" style="left:__P_BEGIN__%;width:__P_LENGTH__%"></div>`,
  PIPE_V :
      `<div class="rpe pipe vertical" style="bottom:__P_BEGIN__%;height:__P_LENGTH__%"></div>`,
  FLOW_H :
      `<div class="rpe-content pipe horizontal __BG_COLOR_CLS__" style="left:__P_BEGIN__%;width:__P_LENGTH__%"></div>`,
  FLOW_V :
      `<div class="rpe-content pipe vertical __BG_COLOR_CLS__" style="bottom:__P_BEGIN__%;height:__P_LENGTH__%"></div>`,
} as const;

export class RichProgress extends Fragment {
  private _percent: number = 0;
  private _threshold: number = 30;
  private _direction: "H" | "V" = "H";
  private _r_node: number = 0; // Node radius in percent
  private _stateClassName: string | null = null;

  constructor() {
    super();
    this._percent = 0;
    this._threshold = 30;
    this._direction = "H";
    this._r_node = 0;
    this._stateClassName = null;
  }

  setValue(value: number): void {
    if (value < 0 || value > 100) {
      return;
    }
    this._percent = Math.floor(value);
  }
  setDirection(d: "H" | "V"): void { this._direction = d; }
  setStateClassName(name: string | null): void { this._stateClassName = name; }

  _renderOnRender(render: any): void {
    let items: string[] = [];
    let c = this.#getColorClassName(this._percent);
    this._r_node = this.#calculateRNode(render.getWidth(), render.getHeight());

    items.push(this.#renderFirstNode(this._direction, c));
    items.push(this.#renderPipe(this._direction, 0, this._percent, c));
    items.push(this.#renderNode(this._direction, this._percent, c));
    items.push(this.#renderPipe(this._direction, this._percent, 100, c));

    items.push(this.#renderLastNode(this._direction, c));

    render.replaceContent(items.join(""));
  }

  #calculateRNode(w: number, h: number): number {
    if (this._direction == "H") {
      return 100 * h / w / 2;
    } else {
      return 100 * w / h / 2;
    }
  }

  #renderFirstNode(dir: "H" | "V", colorClass: string): string {
    let s: string = dir == "H" ? _CFT_RICH_PROGRESS.FIRST_NODE_H
                       : _CFT_RICH_PROGRESS.FIRST_NODE_V;
    return s.replace("__BG_COLOR_CLS__", colorClass);
  }

  #renderLastNode(dir: "H" | "V", colorClass: string): string {
    let s: string = dir == "H" ? _CFT_RICH_PROGRESS.LAST_NODE_H
                       : _CFT_RICH_PROGRESS.LAST_NODE_V;
    return s.replace("__BG_COLOR_CLS__", colorClass);
  }

  #renderPipe(dir: "H" | "V", fromPercent: number, toPercent: number, colorClass: string): string {
    let pFrom = this.#regulatePercent(fromPercent);
    let pTo = this.#regulatePercent(toPercent);
    if (pTo - pFrom < this._r_node * 2) {
      return "";
    }
    let s: string = dir == "H" ? _CFT_RICH_PROGRESS.PIPE_H : _CFT_RICH_PROGRESS.PIPE_V;
    s = s.replace("__P_BEGIN__", String(pFrom + this._r_node));
    s = s.replace("__P_LENGTH__", String(pTo - pFrom - this._r_node * 2));
    if (toPercent > this._percent) {
      return s;
    } else {
      return s + this.#renderFlow(dir, pFrom, pTo, colorClass);
    }
  }

  #renderFlow(dir: "H" | "V", fromPercent: number, toPercent: number, colorClass: string): string {
    let s: string = dir == "H" ? _CFT_RICH_PROGRESS.FLOW_H : _CFT_RICH_PROGRESS.FLOW_V;
    s = s.replace("__P_BEGIN__", String(fromPercent + this._r_node * 0.5));
    s = s.replace("__P_LENGTH__", String(toPercent - fromPercent - this._r_node));
    s = s.replace("__BG_COLOR_CLS__", colorClass);
    return s;
  }

  #renderNode(dir: "H" | "V", percent: number, colorClass: string): string {
    let p = this.#regulatePercent(percent);
    let s: string = dir == "H" ? _CFT_RICH_PROGRESS.NODE_H : _CFT_RICH_PROGRESS.NODE_V;
    s = s.replace("__P_BEGIN__", String(p - this._r_node));
    s = s.replace("__BG_COLOR_CLS__", colorClass);
    return s;
  }

  #regulatePercent(p: number): number {
    return this._r_node + p * (100 - this._r_node * 2) / 100;
  }

  #getColorClassName(percent: number): string {
    if (this._stateClassName) {
      return this._stateClassName;
    }
    if (percent == 100) {
      return "bggreen";
    }

    if (percent < this._threshold) {
      return "bgfirebrick";
    }
    return "bgyellow";
  }
}

