import { ServerDataObject } from './ServerDataObject.js';

export class Currency extends ServerDataObject {
  getName() { return this._data.name; }
  getCode() { return this._data.code; }
  getSymbol() { return this._data.symbol; }
  getIcon() { return this._data.icon; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Currency = Currency;
}
