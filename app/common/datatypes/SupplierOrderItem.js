export class SupplierOrderItem extends dat.ServerDataObject {
  getDescription() { return this._data.product.description; }
  getQuantity() { return this._data.product.quantity; }
  getUnitPrice() { return this._data.product.unit_price; }
  getState() { return this._data.state; }
  getStatus() {
    return this._data.status ? this._data.status : this._data.state;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.SupplierOrderItem = SupplierOrderItem;
}
