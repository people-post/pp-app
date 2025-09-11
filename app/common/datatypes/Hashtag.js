(function(dat) {
class Hashtag extends dat.ServerDataObject {
  getText() { return this._data.text; }
};
dat.Hashtag = Hashtag;
}(window.dat = window.dat || {}));
