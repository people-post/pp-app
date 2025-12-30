import { View } from '../../lib/ui/controllers/views/View.js';

export class FProductList extends gui.FSocialItemList {
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
    let v = new View();
    let f = new shop.FvcProduct();
    f.setProductId(itemId);
    v.setContentFragment(f);
    return v;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FProductList = FProductList;
}
