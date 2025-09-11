(function(dat) {
class TimeClockRecord extends dat.ServerDataObject {
  getTotal() { return this._data.total; }
};

dat.TimeClockRecord = TimeClockRecord;
}(window.dat = window.dat || {}));
