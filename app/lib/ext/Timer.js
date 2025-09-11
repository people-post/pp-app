(function(ext) {
class Timer {
  constructor() { this._jobId = null; }

  isSet() { return this._jobId != null; }

  set(jobFunc, delay) {
    this.cancel();
    this._jobId = window.setTimeout(jobFunc, delay);
  }

  cancel() {
    if (this._jobId) {
      window.clearTimeout(this._jobId);
      this._jobId = null;
    }
  }
};

ext.Timer = Timer;
}(window.ext = window.ext || {}));
