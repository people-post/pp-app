import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class FProductDelivery extends Fragment {
  static T_LAYOUT = {
    COMPACT : "COMPACT",
    FULL: "FULL",
  };

  constructor() {
    super();
    this._data = null;
    this._tLayout = null;
  }

  setData(d) { this._data = d; }
  setLayoutType(t) { this._tLayout = t; }

  _getProduct() {
    return this._dataSource.getProductForProductDeliveryFragment(this);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FProductDelivery = FProductDelivery;
}
