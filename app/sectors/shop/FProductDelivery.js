
class FProductDelivery extends ui.Fragment {
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

shop.FProductDelivery = FProductDelivery;
}(window.shop = window.shop || {}));
