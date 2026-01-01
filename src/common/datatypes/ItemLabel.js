import { ServerDataObject } from './ServerDataObject.js';

export class ItemLabel extends ServerDataObject {
  getName() { return this._data.name; }
};
