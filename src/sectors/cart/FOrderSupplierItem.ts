const _CFT_CUSTOMER_ORDER_SUPPLIER_ITEM = {
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

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Exchange } from '../../common/dba/Exchange.js';
import { Utilities } from '../../common/Utilities.js';
import { SupplierOrderPublic } from '../../common/datatypes/SupplierOrderPublic.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FOrderSupplierItem extends Fragment {
  protected _currencyId: string | null;
  protected _item: SupplierOrderPublic | null;

  constructor() {
    super();
    this._currencyId = null;
    this._item = null;
  }

  setCurrencyId(id: string | null): void { this._currencyId = id; }
  setItem(item: SupplierOrderPublic): void { this._item = item; }

  _renderOnRender(render: Render): void {
    if (!this._item) {
      return;
    }
    let p = new Panel();
    p.setClassName("flex space-between");
    render.wrapPanel(p);
    p.replaceContent(this.#renderItem(this._item));
  }

  #renderItem(item: SupplierOrderPublic): string {
    let s = _CFT_CUSTOMER_ORDER_SUPPLIER_ITEM.MAIN;
    s = s.replace("__DESCRIPTION__", item.getDescription());
    s = s.replace("__QTY__", item.getQuantity().toString());
    s = s.replace("__STATUS__",
                  Utilities.renderStatus(item.getState(), item.getStatus()));
    s = s.replace("__ACTION__", "");
    let c = Exchange.getCurrency(this._currencyId);
    let ss = Utilities.renderPrice(c, item.getUnitPrice());
    s = s.replace("__UNIT_PRICE__", ss);
    return s;
  }
};
