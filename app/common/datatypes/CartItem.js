export class CartItem {
  constructor(data) { this._data = data; }
  getId() { return this._data.id; }
  getProductId() { return this._data.product_id; }
  getSpecs() { return this._data.specifications; }
  getQuantity() { return this._data.quantity; }
  getCartId() { return this._data.cart_id; }
  getPreferredCurrencyId() {
    if (this._data.preferred_currency_id) {
      return this._data.preferred_currency_id;
    }
    let prices = this.getPrices();
    return prices.length ? prices[0].currency_id : null;
  }
  getPrices() { return this._data.prices ? this._data.prices : []; }
  getPrice(currencyId = null) {
    let p = this.getUnitPrice(currencyId);
    return p ? p * this.getQuantity() : null;
  }

  getUnitPrice(currencyId = null) {
    let prices = this.getPrices();
    if (prices.length == 0) {
      return null;
    }
    if (currencyId) {
      for (let p of prices) {
        if (p.currency_id == currencyId) {
          return p.value;
        }
      }
    }
    return prices[0].value;
  }

  getAllCurrencyIds() {
    let ids = this.getPrices().map(p => p.currency_id).filter(id => id);
    return Array.from(new Set(ids));
  }

  changeQuantity(dQty) { this._data.quantity += dQty; }

  toJsonDict() {
    return {
      product_id : this.getProductId(),
      preferred_currency_id : this.getPreferredCurrencyId(),
      quantity : this.getQuantity(),
      specifications : []
    };
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.CartItem = CartItem;
}
