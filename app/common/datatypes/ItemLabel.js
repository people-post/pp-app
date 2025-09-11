(function(dat) {
class ItemLabel extends dat.ServerDataObject {
  getName() { return this._data.name; }
};

dat.ItemLabel = ItemLabel;
}(window.dat = window.dat || {}));
