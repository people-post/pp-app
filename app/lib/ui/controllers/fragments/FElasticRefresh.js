import { Panel } from '../../renders/panels/Panel.js';
import { Fragment } from './Fragment.js';
import { ICONS } from '../../Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';

const _CPT_ELASTIC_REFRESH = {
  MAIN : `<div class="flex space-around">
    <span id="__ID_ICON__" class="inline-block s-icon6"></span>
  </div>`,
};

class PElasticRefresh extends Panel {
  #pIcon;

  constructor() {
    super();
    this.#pIcon = new Panel();
  }

  getIconPanel() { return this.#pIcon; }

  _renderFramework() {
    let s = _CPT_ELASTIC_REFRESH.MAIN;
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pIcon.attach(this._getSubElementId("I"));
  }
};

export class FElasticRefresh extends Fragment {
  #mActiveTouch = new Map();
  #value = 0;
  #vTh = 36; // Threshold to start attenuation
  #height = 0;
  #fullValue = 100; // Pixels needed to reach 100%
  #timeout = null;

  observe(element) {
    element.addEventListener("touchstart", evt => this.#onTouchStart(evt));
    element.addEventListener("touchcancel", evt => this.#onTouchCancel(evt));
    element.addEventListener("touchmove", evt => this.#onTouchMove(evt));
    element.addEventListener("touchend", evt => this.#onTouchEnd(evt));
    element.addEventListener("wheel", evt => this.#onWheelEvent(evt));
  }

  _renderOnRender(render) {
    let panel = new PElasticRefresh();
    panel.setClassName("flex flex-column flex-end hide-overflow");
    render.wrapPanel(panel);

    panel.setHeight(this.#height, "px");
    let percent = this.#getPercentage();

    let p = panel.getIconPanel();
    if (percent >= 1) {
      p.replaceContent(CommonUtilities.renderSvgFuncIcon(ICONS.SOLID_DOWN));
    } else {
      p.replaceContent(CommonUtilities.renderSvgFuncIcon(ICONS.DOWN));
    }

    if (percent > 0 && percent < 1) {
      let deg = percent * 360;
      p.setStyle("transform", "rotate(" + deg + "deg)");
    }
  }

  #hasProgress() { return this.#value > 0; }

  #getPercentage() {
    let dv = this.#value - this.#vTh;
    return dv > 0 ? dv / (this.#fullValue - this.#vTh) : 0;
  }

  #addForce(dy, retractable = false) {
    if (dy > 0) {
      // Attnuate force when pulling
      // Attenuation is using sqrt
      this.#value += dy;
      this.#value = Math.max(0, this.#value);
      this.#height = this.#value > this.#vTh
                         ? Math.sqrt(this.#value * this.#vTh)
                         : this.#value;
    } else {
      // Non attenuated force when releasing
      this.#height += dy;
      this.#height = Math.max(0, this.#height);
      this.#value = this.#height > this.#vTh
                        ? this.#height * this.#height / this.#vTh
                        : this.#height;
    }
    this.render();

    if (retractable && this.#value > 0) {
      if (this.#timeout) {
        window.clearTimeout(this.#timeout);
      }
      let p = this.#getPercentage();
      // Waiting time range from 1s to 0.5s
      // Lower percentage has longer waiting time
      let t = 1000 - p * 500;
      this.#timeout = window.setTimeout(() => this.#conclude(), t);
    }
  }

  #resetProgress(percent) {
    this.#value = 0;
    this.#height = 0;
    this.render();
  }

  #conclude() {
    if (this.#value >= this.#fullValue) {
      // 100%
      this._delegate.onElasticRefreshFragmentRequstRefresh(this);
    }
    this.#resetProgress();
  }

  #onWheelEvent(evt) {
    if (!this._dataSource.shouldElasticRefreshFragmentEngage(this)) {
      return;
    }
    // dy > 0 is wheel down but screen up, need to invert sign
    let dy = -evt.deltaY;
    let b = this.#hasProgress();
    if (!b && dy < 0) {
      // Going up again
    } else {
      // Attenuate by 5
      this.#addForce(dy / 5, true);
      evt.preventDefault();
    }
  }

  #onTouchStart(evt) {
    if (!this._dataSource.shouldElasticRefreshFragmentEngage(this)) {
      return;
    }

    for (let t of evt.changedTouches) {
      this.#mActiveTouch.set(t.identifier, t);
    }

    // Touch start is called per touch, only allow single touch here
    if (this.#mActiveTouch.size > 1) {
      this.#onTouchCancel();
    }
  }

  #onTouchCancel(evt) {
    if (this.#mActiveTouch.size > 0) {
      this.#mActiveTouch.clear();
      this.#resetProgress();
    }
  }

  #onTouchMove(evt) {
    // Should only have 1 touch (See #onTouchStart)
    if (this.#mActiveTouch.size != 1) {
      return;
    }

    let t = evt.changedTouches[0];
    let tLast = this.#mActiveTouch.get(t.identifier);
    if (tLast) {
      let dy = t.pageY - tLast.pageY;
      this.#mActiveTouch.set(t.identifier, t);
      let b = this.#hasProgress();
      if (!b && dy < 0) {
        // Going up again
        this.#onTouchCancel();
      } else {
        this.#addForce(dy);
        // Prevent default when pulling
        evt.preventDefault();
      }
    }
  }

  #onTouchEnd(evt) {
    if (this.#mActiveTouch.size < 1) {
      return;
    }

    for (let t of evt.changedTouches) {
      let tLast = this.#mActiveTouch.get(t.identifier);
      if (tLast) {
        this.#mActiveTouch.delete(t.identifier);
      }
    }

    if (this.#mActiveTouch.size == 0) {
      // Last (the only) finger released, scroll end.
      this.#conclude();
    }
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.FElasticRefresh = FElasticRefresh;
}
