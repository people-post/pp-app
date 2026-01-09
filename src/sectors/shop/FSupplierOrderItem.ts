import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Exchange } from '../../common/dba/Exchange.js';
import { Utilities } from '../../common/Utilities.js';
import type Render from '../../lib/ui/renders/Render.js';

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

interface SupplierOrderItemData {
  getDescription(): string;
  getQuantity(): number;
  getUnitPrice(): number;
  getState(): string;
  getStatus(): string;
}

export class FSupplierOrderItem extends Fragment {
  protected _currencyId: string | null = null;
  protected _item: SupplierOrderItemData | null = null;

  constructor() {
    super();
  }

  setCurrencyId(id: string | null): void { this._currencyId = id; }
  setItem(item: SupplierOrderItemData): void { this._item = item; }

  _renderOnRender(render: Render): void {
    if (!this._item) return;
    let p = new Panel();
    p.setClassName("flex space-between");
    render.wrapPanel(p);
    p.replaceContent(this.#renderItem(this._item));
  }

  #renderItem(item: SupplierOrderItemData): string {
    let s = _CFT_SUPPLIER_ORDER_ITEM.MAIN;
    s = s.replace("__DESCRIPTION__", item.getDescription());
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
