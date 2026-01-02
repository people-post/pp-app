export class Logger {
  static s_enable = true;

  static setEnable(b: boolean): void {
    Logger.s_enable = b;
  }

  #prefix: string;

  constructor(name: string) {
    this.#prefix = name + ': ';
  }

  debug(msg: string): void {
    if (Logger.s_enable) {
      console.debug(this.#makeMsg(msg));
    }
  }

  info(msg: string): void {
    if (Logger.s_enable) {
      console.info(this.#makeMsg(msg));
    }
  }

  error(msg: string): void {
    if (Logger.s_enable) {
      console.error(this.#makeMsg(msg));
    }
  }

  #makeMsg(msg: string): string {
    return this.#prefix + msg;
  }
}

export default Logger;

