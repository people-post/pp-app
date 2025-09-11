(function(dat) {
class ProductDelivery extends dat.ServerDataObject {
  getDescription() { return this._data.description; }
  setDescription(d) { this._data.description = d; }
}

dat.ProductDelivery = ProductDelivery;
}(window.dat = window.dat || {}));
