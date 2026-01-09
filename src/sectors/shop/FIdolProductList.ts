import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Product } from '../../common/datatypes/Product.js';
import { FProductList } from './FProductList.js';
import { FProduct } from './FProduct.js';
import { Shop } from '../../common/dba/Shop.js';
import { api } from '../../common/plt/Api.js';

export class FIdolProductList extends FProductList {
  #isBatchLoading: boolean = false;

  _createInfoFragment(id: string): FProduct {
    let f = new FProduct();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setProductId(id);
    f.setSizeType(SocialItem.T_LAYOUT.LARGE);
    return f;
  }

  _asyncLoadFrontItems(): void {}
  _asyncLoadBackItems(): void {
    if (this.#isBatchLoading) {
      return;
    }
    this.#isBatchLoading = true;
    let url = "api/shop/idol_products";
    let fromId = this._getIdRecord().getLastId();
    if (fromId) {
      url += "?before_id=" + fromId;
    }
    api.asyncRawCall(url, (r: string) => this.#onProductsRRR(r));
  }

  #onProductsRRR(responseText: string): void {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInFragment(this, response.error);
    } else {
      let ds = response.data.products;
      if (ds.length) {
        for (let d of ds) {
          let p = new Product(d);
          Shop.updateProduct(p);
          this._getIdRecord().appendId(p.getId());
        }
      } else {
        this._getIdRecord().markComplete();
      }
      this.onScrollFinished();
    }
  }
}
