import { ServerDataObject } from './ServerDataObject.js';

export class ProductDelivery extends ServerDataObject {
  getDescription() { return this._data.description; }
  setDescription(d) { this._data.description = d; }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.ProductDelivery = ProductDelivery;
}
