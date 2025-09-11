(function(dat) {
class PreviewOrderItem {
  constructor(data) { this._data = data; }
  getDescription() { return this._data.description; }
  getSpecs() { return this._data.specs; }
  getQuantity() { return this._data.quantity; }
  getUnitPrice() { return this._data.unit_price; }
};

dat.PreviewOrderItem = PreviewOrderItem;
}(window.dat = window.dat || {}));
