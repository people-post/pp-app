export class Hashtag extends dat.ServerDataObject {
  getText() { return this._data.text; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Hashtag = Hashtag;
}
