import { ServerDataObject } from './ServerDataObject.js';

export class Hashtag extends ServerDataObject {
  getText() { return this._data.text; }
};


