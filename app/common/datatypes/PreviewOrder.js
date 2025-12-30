export class PreviewOrder extends dat.ServerDataObject {
  constructor(data) {
    super(data);
    this._items = this.#initItems(data.items);
  }

  getCurrencyId() { return this._data.currency_id; }
  getItems() { return this._items; }
  getTotal() { return this._data.total; }

  #initItems(dataList) {
    let items = [];
    for (let d of dataList) {
      items.push(new dat.PreviewOrderItem(d));
    }
    return items;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.PreviewOrder = PreviewOrder;
}
