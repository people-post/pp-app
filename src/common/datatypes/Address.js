import { ServerDataObject } from './ServerDataObject.js';

export class Address extends ServerDataObject {
  getOwnerId() { return this._data.owner_id; }
  getNickname() { return this._data.nickname; }
  getName() { return this._data.name; }
  getCountry() { return this._data.country; }
  getState() { return this._data.state; }
  getCity() { return this._data.city; }
  getZipcode() { return this._data.zipcode; }
  getLine(idx) { return this._data.lines[idx]; }
};
