import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

const _CFT_VOTE_PROGRESS = {
  MAIN : `<div class="vote-progress-bg">
      <span class="vote-progress-target" style="left:__TARGET__%;"></span>
      <span class="vote-progress-yea __COLOR__" style="width:__PERCENT__%;"></span>
      <span class="vote-progress-nay" style="width:__NAY_PERCENT__%;"></span>
      <span class="w100 s-font7 bold center-align vote-progress-text">__VALUE__/__TOTAL__</span>
    </div>`,
}

export class VoteProgressFragment extends Fragment {
  constructor() {
    super();
    this._config = {"value" : 0, "threshold" : 0, "total" : 0};
  }

  setConfig(config) { this._config = config; }

  _renderContent() {
    let s = _CFT_VOTE_PROGRESS.MAIN;
    s = s.replace("__PERCENT__", this.#getPercent());
    s = s.replace("__NAY_PERCENT__", this.#getNayPercent());
    s = s.replace("__TARGET__", this.#getTargetPercent());
    s = s.replace("__COLOR__", this.#getColorClass());
    s = s.replace("__VALUE__", this._config.value);
    s = s.replace("__TOTAL__", this._config.total);
    return s;
  }

  #getColorClass() {
    if (this._config.value > this._config.threshold) {
      return "bggreen";
    }
    return "bgyellow";
  }

  #getNayPercent() {
    if (this._config.total > 0) {
      return this._config.nayValue * 100 / this._config.total;
    } else {
      return 100;
    }
  }

  #getPercent() {
    if (this._config.total > 0) {
      return this._config.value * 100 / this._config.total;
    } else {
      return 100;
    }
  }
  #getTargetPercent() {
    if (this._config.total > 0) {
      return this._config.threshold * 100 / this._config.total;
    } else {
      return 100;
    }
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.VoteProgressFragment = VoteProgressFragment;
}

