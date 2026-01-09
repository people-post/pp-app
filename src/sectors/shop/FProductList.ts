import { View } from '../../lib/ui/controllers/views/View.js';
import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { FSocialItemList } from '../../common/gui/FSocialItemList.js';
import { FvcProduct } from './FvcProduct.js';
import { FProduct } from './FProduct.js';

export class FProductList extends FSocialItemList {
  // TODO: Swith id to SocialItemId
  #idRecord: UniLongListIdRecord;

  constructor() {
    super();
    this.#idRecord = new UniLongListIdRecord();
  }

  isProductSelectedInProductInfoFragment(_fProductInfo: FProduct, productId: string): boolean {
    return this.getCurrentId() == productId;
  }

  onClickInProductInfoFragment(_fProductInfo: FProduct, productId: string): void {
    this.switchToItem(productId);
  }

  _getIdRecord(): UniLongListIdRecord { return this.#idRecord; }

  _createItemView(itemId: string): View {
    let v = new View();
    let f = new FvcProduct();
    f.setProductId(itemId);
    v.setContentFragment(f);
    return v;
  }
}
