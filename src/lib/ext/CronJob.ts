export class CronJob {
  #fId: number | null = null;
  #fBeginId: number | null = null;
  #fEndId: number | null = null;

  constructor() {
    this.#fId = null;
    this.#fBeginId = null;
    this.#fEndId = null;
  }

  isSet(): boolean {
    return this.#fBeginId !== null;
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
      this.#fEndId = window.setTimeout(() => this.#onTimeout(onEnd), tMax + delay);
    }
    this.#fBeginId = window.setTimeout(() => {
      this.#fId = window.setInterval(jobFunc, period);
    }, delay);
  }

  stop(): void {
    if (this.#fBeginId !== null) {
      window.clearTimeout(this.#fBeginId);
      this.#fBeginId = null;
    }
    if (this.#fEndId !== null) {
      window.clearTimeout(this.#fEndId);
      this.#fEndId = null;
    }
    if (this.#fId !== null) {
      window.clearInterval(this.#fId);
      this.#fId = null;
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

