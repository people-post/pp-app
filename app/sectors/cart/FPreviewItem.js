
const _CFT_PREVIEW_ORDER_ITEM = {
  MAIN : `<div class="w40">__DESCRIPTION__</div>
    <div>__QTY__x</div>
    <div>__UNIT_PRICE__</div>`,
}

export class FPreviewItem extends ui.Fragment {
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
    let s = _CFT_PREVIEW_ORDER_ITEM.MAIN;
    s = s.replace("__DESCRIPTION__", item.getDescription());
    s = s.replace("__QTY__", item.getQuantity().toString());
    let c = dba.Exchange.getCurrency(this._currencyId);
    let ss = Utilities.renderPrice(c, item.getUnitPrice());
    s = s.replace("__UNIT_PRICE__", ss);
    return s;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.FPreviewItem = FPreviewItem;
}
