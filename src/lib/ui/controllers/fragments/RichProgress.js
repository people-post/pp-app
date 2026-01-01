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
}

export class RichProgress extends Fragment {
  constructor() {
    super();
    this._percent = 0;
    this._threshold = 30;
    this._direction = "H";
    this._r_node = 0; // Node radius in percent
    this._stateClassName = null;
  }

  setValue(value) {
    if (value < 0 || value > 100) {
      return;
    }
    this._percent = Math.floor(value);
  }
  setDirection(d) { this._direction = d; }
  setStateClassName(name) { this._stateClassName = name; }

  _renderOnRender(render) {
    let items = [];
    let c = this.#getColorClassName(this._percent);
    this._r_node = this.#calculateRNode(render.getWidth(), render.getHeight());

    items.push(this.#renderFirstNode(this._direction, c));
    items.push(this.#renderPipe(this._direction, 0, this._percent, c));
    items.push(this.#renderNode(this._direction, this._percent, c));
    items.push(this.#renderPipe(this._direction, this._percent, 100, c));

    items.push(this.#renderLastNode(this._direction, c));

    render.replaceContent(items.join(""));
  }

  #calculateRNode(w, h) {
    if (this._direction == "H") {
      return 100 * h / w / 2;
    } else {
      return 100 * w / h / 2;
    }
  }

  #renderFirstNode(dir, colorClass) {
    let s = dir == "H" ? _CFT_RICH_PROGRESS.FIRST_NODE_H
                       : _CFT_RICH_PROGRESS.FIRST_NODE_V;
    return s.replace("__BG_COLOR_CLS__", colorClass);
  }

  #renderLastNode(dir, colorClass) {
    let s = dir == "H" ? _CFT_RICH_PROGRESS.LAST_NODE_H
                       : _CFT_RICH_PROGRESS.LAST_NODE_V;
    return s.replace("__BG_COLOR_CLS__", colorClass);
  }

  #renderPipe(dir, fromPercent, toPercent, colorClass) {
    let pFrom = this.#regulatePercent(fromPercent);
    let pTo = this.#regulatePercent(toPercent);
    if (pTo - pFrom < this._r_node * 2) {
      return "";
    }
    let s = dir == "H" ? _CFT_RICH_PROGRESS.PIPE_H : _CFT_RICH_PROGRESS.PIPE_V;
    s = s.replace("__P_BEGIN__", pFrom + this._r_node);
    s = s.replace("__P_LENGTH__", pTo - pFrom - this._r_node * 2);
    if (toPercent > this._percent) {
      return s;
    } else {
      return s + this.#renderFlow(dir, pFrom, pTo, colorClass);
    }
  }

  #renderFlow(dir, fromPercent, toPercent, colorClass) {
    let s = dir == "H" ? _CFT_RICH_PROGRESS.FLOW_H : _CFT_RICH_PROGRESS.FLOW_V;
    s = s.replace("__P_BEGIN__", fromPercent + this._r_node * 0.5);
    s = s.replace("__P_LENGTH__", toPercent - fromPercent - this._r_node);
    s = s.replace("__BG_COLOR_CLS__", colorClass);
    return s;
  }

  #renderNode(dir, percent, colorClass) {
    let p = this.#regulatePercent(percent);
    let s = dir == "H" ? _CFT_RICH_PROGRESS.NODE_H : _CFT_RICH_PROGRESS.NODE_V;
    s = s.replace("__P_BEGIN__", p - this._r_node);
    s = s.replace("__BG_COLOR_CLS__", colorClass);
    return s;
  }

  #regulatePercent(p) {
    return this._r_node + p * (100 - this._r_node * 2) / 100;
  }

  #getColorClassName(percent) {
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
};
