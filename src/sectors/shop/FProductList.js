import { View } from '../../lib/ui/controllers/views/View.js';
import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { FSocialItemList } from '../../common/gui/FSocialItemList.js';
import { FvcProduct } from './FvcProduct.js';

export class FProductList extends FSocialItemList {
  // TODO: Swith id to SocialItemId
  #idRecord;

  constructor() {
    super();
    this.#idRecord = new UniLongListIdRecord();
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
    let f = new FvcProduct();
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
