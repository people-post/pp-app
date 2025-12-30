import { ServerDataObject } from './ServerDataObject.js';

export class SquareTerminal extends ServerDataObject {
  getDeviceId() { return this._data.device_id; }
  getPairCode() { return this._data.pair_code; }
  getPairBy() { return this._data.pair_by; }
  getStatus() { return this._data.status; }
  getPairedAt() { return this._data.paired_at; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.SquareTerminal = SquareTerminal;
}
