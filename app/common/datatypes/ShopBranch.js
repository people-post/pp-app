import { ServerDataObject } from './ServerDataObject.js';

export class ShopBranch extends ServerDataObject {
  getName() { return this._data.name; }
  getOwnerId() { return this._data.owner_id; }
  getAddressId() { return this._data.address_id; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.ShopBranch = ShopBranch;
}
