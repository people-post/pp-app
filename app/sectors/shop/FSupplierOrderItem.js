(function(shop) {
const _CFT_SUPPLIER_ORDER_ITEM = {
  MAIN : `<div class="w40">__DESCRIPTION__</div>
  <div>
    <div>__QTY__x</div>
    <div>
      __STATUS__
      __ACTION__
    </div>
  </div>
  <div>__UNIT_PRICE__</div>`,
}

class FSupplierOrderItem extends ui.Fragment {
  constructor() {
    super();
    this._currencyId = null;
    this._item = null;
  }

  setCurrencyId(id) { this._currencyId = id; }
  setItem(item) { this._item = item; }

  _renderOnRender(render) {
    let p = new ui.Panel();
    p.setClassName("flex space-between");
    render.wrapPanel(p);
    p.replaceContent(this.#renderItem(this._item));
  }

  #renderItem(item) {
    let s = _CFT_SUPPLIER_ORDER_ITEM.MAIN;
    s = s.replace("__DESCRIPTION__", item.getDescription());
    s = s.replace("__QTY__", item.getQuantity().toString());
    let c = dba.Exchange.getCurrency(this._currencyId);
    let ss = Utilities.renderPrice(c, item.getUnitPrice());
    s = s.replace("__STATUS__",
                  Utilities.renderStatus(item.getState(), item.getStatus()));
    s = s.replace("__ACTION__", "");
    s = s.replace("__UNIT_PRICE__", ss);
    // TODO: Show quanity returned
    return s;
  }
};

shop.FSupplierOrderItem = FSupplierOrderItem;
}(window.shop = window.shop || {}));
