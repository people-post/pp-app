import { ServerDataObject } from './ServerDataObject.js';

export class ProductDelivery extends ServerDataObject {
  getDescription() { return this._data.description; }
  setDescription(d) { this._data.description = d; }
}


