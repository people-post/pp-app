import { ServerDataObject } from './ServerDataObject.js';

export class TimeClock extends ServerDataObject {
  getServerTime() { return new Date(this._data.t_current * 1000); }
  getDurationMs() {
    return this.getServerTime().getTime() - this.getCreationTime().getTime();
  }
};


