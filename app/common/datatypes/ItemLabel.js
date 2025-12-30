import { ServerDataObject } from './ServerDataObject.js';

export class ItemLabel extends ServerDataObject {
  getName() { return this._data.name; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.ItemLabel = ItemLabel;
}
