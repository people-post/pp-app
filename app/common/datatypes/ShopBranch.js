(function(dat) {
class ShopBranch extends dat.ServerDataObject {
  getName() { return this._data.name; }
  getOwnerId() { return this._data.owner_id; }
  getAddressId() { return this._data.address_id; }
};

dat.ShopBranch = ShopBranch;
}(window.dat = window.dat || {}));
