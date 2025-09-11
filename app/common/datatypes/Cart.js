(function(dat) {
class Cart {
  // Synced with backend
  static T_ID = {
    ACTIVE : "ACTIVE",
    RESERVE: "RESERVE",
  };

  constructor() { this._mItem = new Map(); }

  get(id) { return this._mItem.get(id); }
  getItems() { return Array.from(this._mItem.values()); }
  getAllCurrencyIds() {
    let ids = [];
    for (let item of this._mItem.values()) {
      ids = ids.concat(item.getAllCurrencyIds());
    }
    return Array.from(new Set(ids));
  }

  set(id, item) { this._mItem.set(id, item); }

  changeQuantity(id, dQty) {
    let item = this._mItem.get(id);
    if (item) {
      if (dQty > -item.getQuantity()) {
        item.changeQuantity(dQty);
      } else {
        this.remove(id);
      }
    }
  }
  remove(id) { return this._mItem.delete(id); }

  countItems() {
    let n = 0;
    for (let item of this._mItem.values()) {
      n += item.getQuantity();
    }
    return n;
  }
  countProduct(productId) {
    let count = 0;
    for (let i of this._mItem.values()) {
      if (i.getProductId() == productId) {
        count += i.getQuantity();
      }
    }
    return count;
  }
};

dat.Cart = Cart;
}(window.dat = window.dat || {}));
