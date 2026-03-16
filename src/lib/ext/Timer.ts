export class Timer {
  #jobId: number | null = null;

  constructor() {
    this.#jobId = null;
  }

  isSet(): boolean {
    return this.#jobId !== null;
  }

  set(jobFunc: () => void, delay: number): void {
    this.cancel();
    this.#jobId = window.setTimeout(jobFunc, delay);
  }

  cancel(): void {
    if (this.#jobId !== null) {
      window.clearTimeout(this.#jobId);
      this.#jobId = null;
    }
  }
}

export default Timer;

