(function(dat) {
class SupplierOrderItem extends dat.ServerDataObject {
  getDescription() { return this._data.product.description; }
  getQuantity() { return this._data.product.quantity; }
  getUnitPrice() { return this._data.product.unit_price; }
  getState() { return this._data.state; }
  getStatus() {
    return this._data.status ? this._data.status : this._data.state;
  }
};

dat.SupplierOrderItem = SupplierOrderItem;
}(window.dat = window.dat || {}));
