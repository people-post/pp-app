import { ServerDataObject } from './ServerDataObject.js';

export class TimeClockRecord extends ServerDataObject {
  getTotal() { return this._data.total; }
};
