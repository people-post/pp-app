import { ServerDataObject } from './ServerDataObject.js';

export class ShopRegister extends ServerDataObject {
  getName() { return this._data.name; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.ShopRegister = ShopRegister;
}
