(function(dat) {
class TimeClock extends dat.ServerDataObject {
  getServerTime() { return new Date(this._data.t_current * 1000); }
  getDurationMs() {
    return this.getServerTime().getTime() - this.getCreationTime().getTime();
  }
};

dat.TimeClock = TimeClock;
}(window.dat = window.dat || {}));
