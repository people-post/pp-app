import { ServerDataObject } from './ServerDataObject.js';

export class Hashtag extends ServerDataObject {
  getText() { return this._data.text; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Hashtag = Hashtag;
}
