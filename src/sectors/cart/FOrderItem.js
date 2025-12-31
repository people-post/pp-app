import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FOrderSupplierItem } from './FOrderSupplierItem.js';

export class FOrderItem extends Fragment {
  constructor() {
    super();
    this._fSubItems = new FSimpleFragmentList();
    this.setChild("items", this._fSubItems);
    this._item = null;
  }

  setItem(item) { this._item = item; }

  _renderOnRender(render) {
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.FOrderItem = FOrderItem;
}
