export class CronJob {
  protected _fId: number | null = null;
  protected _fBeginId: number | null = null;
  protected _fEndId: number | null = null;

  constructor() {
    this._fId = null;
    this._fBeginId = null;
    this._fEndId = null;
  }

  isSet(): boolean {
    return this._fBeginId !== null;
  }

  reset(
    jobFunc: () => void,
    period: number,
    tMax: number | null,
    onEnd: (() => void) | null,
    delay = 0
  ): void {
    this.stop();
    if (tMax) {
      if (tMax < period) {
        return;
      }
      this._fEndId = window.setTimeout(() => this.#onTimeout(onEnd), tMax + delay);
    }
    this._fBeginId = window.setTimeout(() => {
      this._fId = window.setInterval(jobFunc, period);
    }, delay);
  }

  stop(): void {
    if (this._fBeginId !== null) {
      window.clearTimeout(this._fBeginId);
      this._fBeginId = null;
    }
    if (this._fEndId !== null) {
      window.clearTimeout(this._fEndId);
      this._fEndId = null;
    }
    if (this._fId !== null) {
      window.clearInterval(this._fId);
      this._fId = null;
    }
  }

  #onTimeout(onEnd: (() => void) | null): void {
    this.stop();
    if (onEnd) {
      onEnd();
    }
  }
}

export default CronJob;

