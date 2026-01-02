export class Timer {
  protected _jobId: number | null = null;

  constructor() {
    this._jobId = null;
  }

  isSet(): boolean {
    return this._jobId !== null;
  }

  set(jobFunc: () => void, delay: number): void {
    this.cancel();
    this._jobId = window.setTimeout(jobFunc, delay);
  }

  cancel(): void {
    if (this._jobId !== null) {
      window.clearTimeout(this._jobId);
      this._jobId = null;
    }
  }
}

export default Timer;

