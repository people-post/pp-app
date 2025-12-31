export class Logger {
  static s_enable = true;
  static setEnable(b) { this.s_enable = b; }

  constructor(name) { this._prefix = name + ": "; }

  debug(msg) {
    this.constructor.s_enable && console.debug(this.#makeMsg(msg));
  }
  info(msg) { this.constructor.s_enable && console.info(this.#makeMsg(msg)); }
  error(msg) {
    this.constructor.s_enable && console.error(this.#makeMsg(msg));
  }

  #makeMsg(msg) { return this._prefix + msg; }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ext = window.ext || {};
  window.ext.Logger = Logger;
}
