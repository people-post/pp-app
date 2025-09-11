(function(dat) {
class ShopRegister extends dat.ServerDataObject {
  getName() { return this._data.name; }
};

dat.ShopRegister = ShopRegister;
}(window.dat = window.dat || {}));
