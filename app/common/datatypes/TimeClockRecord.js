export class TimeClockRecord extends dat.ServerDataObject {
  getTotal() { return this._data.total; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.TimeClockRecord = TimeClockRecord;
}
