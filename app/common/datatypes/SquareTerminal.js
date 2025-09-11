(function(dat) {
class SquareTerminal extends dat.ServerDataObject {
  getDeviceId() { return this._data.device_id; }
  getPairCode() { return this._data.pair_code; }
  getPairBy() { return this._data.pair_by; }
  getStatus() { return this._data.status; }
  getPairedAt() { return this._data.paired_at; }
};

dat.SquareTerminal = SquareTerminal;
}(window.dat = window.dat || {}));
