import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Exchange } from '../../common/dba/Exchange.js';
import { Utilities } from '../../common/Utilities.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SupplierOrderItem } from '../../common/datatypes/SupplierOrderItem.js';

const _CFT_PREVIEW_ORDER_ITEM = {
  MAIN : `<div class="w40">__DESCRIPTION__</div>
    <div>__QTY__x</div>
    <div>__UNIT_PRICE__</div>`,
}

export class FPreviewItem extends Fragment {
  protected _currencyId: string | null;
  protected _item: SupplierOrderItem | null;

  constructor() {
    super();
    this._currencyId = null;
    this._item = null;
  }

  setCurrencyId(id: string | null): void { this._currencyId = id; }
  setItem(item: SupplierOrderItem): void { this._item = item; }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._item) {
      return;
    }
    let p = new Panel();
    p.setClassName("tw:flex tw:justify-between");
    render.wrapPanel(p);
    p.replaceContent(this.#renderItem(this._item));
  }

  #renderItem(item: SupplierOrderItem): string {
    let s = _CFT_PREVIEW_ORDER_ITEM.MAIN;
    s = s.replace("__DESCRIPTION__", item.getDescription() || "");
    s = s.replace("__QTY__", item.getQuantity().toString());
    let c = Exchange.getCurrency(this._currencyId);
    let ss = Utilities.renderPrice(c, item.getUnitPrice());
    s = s.replace("__UNIT_PRICE__", ss);
    return s;
  }
};
