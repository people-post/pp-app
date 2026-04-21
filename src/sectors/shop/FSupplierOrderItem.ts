import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Exchange } from '../../common/dba/Exchange.js';
import { Utilities } from '../../common/Utilities.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SupplierOrderItem } from '../../common/datatypes/SupplierOrderItem.js';

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
} as const;

export class FSupplierOrderItem extends Fragment {
  protected _currencyId: string | null = null;
  protected _item: SupplierOrderItem | null = null;

  constructor() {
    super();
  }

  setCurrencyId(id: string | null): void { this._currencyId = id; }
  setItem(item: SupplierOrderItem): void { this._item = item; }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._item) return;
    let p = new Panel();
    p.setClassName("tw:flex tw:justify-between");
    render.wrapPanel(p);
    p.replaceContent(this.#renderItem(this._item));
  }

  #renderItem(item: SupplierOrderItem): string {
    let s: string = _CFT_SUPPLIER_ORDER_ITEM.MAIN;
    s = s.replace("__DESCRIPTION__", item.getDescription() || "");
    s = s.replace("__QTY__", item.getQuantity().toString());
    if (!this._currencyId) return s;
    let c = Exchange.getCurrency(this._currencyId);
    let ss = Utilities.renderPrice(c, item.getUnitPrice());
    s = s.replace("__STATUS__",
                  Utilities.renderStatus(item.getState(), item.getStatus()));
    s = s.replace("__ACTION__", "");
    s = s.replace("__UNIT_PRICE__", ss);
    // TODO: Show quanity returned
    return s;
  }
}
