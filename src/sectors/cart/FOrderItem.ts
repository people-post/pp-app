import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FOrderSupplierItem } from './FOrderSupplierItem.js';
import { SupplierOrderPublic } from '../../common/datatypes/SupplierOrderPublic.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

interface OrderItemData {
  getItems(): SupplierOrderPublic[];
  getCurrencyId(): string;
}

export class FOrderItem extends Fragment {
  protected _fSubItems: FSimpleFragmentList;
  protected _item: OrderItemData | null;

  constructor() {
    super();
    this._fSubItems = new FSimpleFragmentList();
    this.setChild("items", this._fSubItems);
    this._item = null;
  }

  setItem(item: OrderItemData): void { this._item = item; }

  _renderOnRender(render: Render): void {
    if (!this._item) {
      return;
    }
    this._fSubItems.clear();
    for (let item of this._item.getItems()) {
      let f = new FOrderSupplierItem();
      f.setCurrencyId(this._item.getCurrencyId());
      f.setItem(item);
      this._fSubItems.append(f);
    }
    this._fSubItems.attachRender(render);
    this._fSubItems.render();
  }
};
