import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

const _CFT_VOTE_PROGRESS = {
  MAIN : `<div class="vote-progress-bg">
      <span class="vote-progress-target" style="left:__TARGET__%;"></span>
      <span class="vote-progress-yea __COLOR__" style="width:__PERCENT__%;"></span>
      <span class="vote-progress-nay" style="width:__NAY_PERCENT__%;"></span>
      <span class="w100 s-font7 bold center-align vote-progress-text">__VALUE__/__TOTAL__</span>
    </div>`,
}

interface VoteConfig {
  value: number;
  threshold: number;
  total: number;
  nayValue?: number;
}

export class VoteProgressFragment extends Fragment {
  private _config: VoteConfig = {"value" : 0, "threshold" : 0, "total" : 0};

  setConfig(config: VoteConfig): void { this._config = config; }

  _renderContent(): string {
    let s = _CFT_VOTE_PROGRESS.MAIN;
    s = s.replace("__PERCENT__", this.#getPercent().toString());
    s = s.replace("__NAY_PERCENT__", this.#getNayPercent().toString());
    s = s.replace("__TARGET__", this.#getTargetPercent().toString());
    s = s.replace("__COLOR__", this.#getColorClass());
    s = s.replace("__VALUE__", this._config.value.toString());
    s = s.replace("__TOTAL__", this._config.total.toString());
    return s;
  }

  #getColorClass(): string {
    if (this._config.value > this._config.threshold) {
      return "bggreen";
    }
    return "bgyellow";
  }

  #getNayPercent(): number {
    if (this._config.total > 0) {
      return (this._config.nayValue || 0) * 100 / this._config.total;
    } else {
      return 100;
    }
  }

  #getPercent(): number {
    if (this._config.total > 0) {
      return this._config.value * 100 / this._config.total;
    } else {
      return 100;
    }
  }
  #getTargetPercent(): number {
    if (this._config.total > 0) {
      return this._config.threshold * 100 / this._config.total;
    } else {
      return 100;
    }
  }
}

export default VoteProgressFragment;
