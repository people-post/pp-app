
class FProductList extends gui.FSocialItemList {
  // TODO: Swith id to SocialItemId
  #idRecord;

  constructor() {
    super();
    this.#idRecord = new dat.UniLongListIdRecord();
  }

  isProductSelectedInProductInfoFragment(fProductInfo, productId) {
    return this.getCurrentId() == productId;
  }

  onClickInProductInfoFragment(fProductInfo, productId) {
    this.switchToItem(productId);
  }

  _getIdRecord() { return this.#idRecord; }

  _createItemView(itemId) {
    let v = new ui.View();
    let f = new shop.FvcProduct();
    f.setProductId(itemId);
    v.setContentFragment(f);
    return v;
  }
};

shop.FProductList = FProductList;
}(window.shop = window.shop || {}));
