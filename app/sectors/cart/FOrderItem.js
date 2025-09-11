(function(cart) {
class FOrderItem extends ui.Fragment {
  constructor() {
    super();
    this._fSubItems = new ui.FSimpleFragmentList();
    this.setChild("items", this._fSubItems);
    this._item = null;
  }

  setItem(item) { this._item = item; }

  _renderOnRender(render) {
    this._fSubItems.clear();
    for (let item of this._item.getItems()) {
      let f = new cart.FOrderSupplierItem();
      f.setCurrencyId(this._item.getCurrencyId());
      f.setItem(item);
      this._fSubItems.append(f);
    }
    this._fSubItems.attachRender(render);
    this._fSubItems.render();
  }
};

cart.FOrderItem = FOrderItem;
}(window.cart = window.cart || {}));
