export class CronJob {
  constructor() {
    this._fId = null;
    this._fBeginId = null;
    this._fEndId = null;
  }

  isSet() { return this._fBeginId != null; }

  reset(jobFunc, period, tMax, onEnd, delay = 0) {
    this.stop();
    if (tMax) {
      if (tMax < period) {
        return;
      }
      this._fEndId =
          window.setTimeout(() => this.#onTimeout(onEnd), tMax + delay);
    }
    this._fBeginId = window.setTimeout(
        () => this._fId = window.setInterval(jobFunc, period), delay);
  }

  stop() {
    if (this._fBeginId) {
      window.clearTimeout(this._fBeginId);
      this._fBeginId = null;
    }
    if (this._fEndId) {
      window.clearTimeout(this._fEndId);
      this._fEndId = null;
    }
    if (this._fId) {
      window.clearInterval(this._fId);
      this._fId = null;
    }
  }

  #onTimeout(onEnd) {
    this.stop();
    if (onEnd) {
      onEnd();
    }
  }
}

export default CronJob;
