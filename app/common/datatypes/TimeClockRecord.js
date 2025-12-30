import { ServerDataObject } from './ServerDataObject.js';

export class TimeClockRecord extends ServerDataObject {
  getTotal() { return this._data.total; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.TimeClockRecord = TimeClockRecord;
}
