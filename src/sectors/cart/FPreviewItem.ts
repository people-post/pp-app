const _CFT_PREVIEW_ORDER_ITEM = {
  MAIN : `<div class="w40">__DESCRIPTION__</div>
    <div>__QTY__x</div>
    <div>__UNIT_PRICE__</div>`,
}
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Exchange } from '../../common/dba/Exchange.js';
import { Utilities } from '../../common/Utilities.js';
import { SupplierOrderPublic } from '../../common/datatypes/SupplierOrderPublic.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FPreviewItem extends Fragment {
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
    let s = _CFT_PREVIEW_ORDER_ITEM.MAIN;
    s = s.replace("__DESCRIPTION__", item.getDescription());
    s = s.replace("__QTY__", item.getQuantity().toString());
    let c = Exchange.getCurrency(this._currencyId);
    let ss = Utilities.renderPrice(c, item.getUnitPrice());
    s = s.replace("__UNIT_PRICE__", ss);
    return s;
  }
};
