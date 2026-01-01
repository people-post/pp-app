import { View } from '../../lib/ui/controllers/views/View.js';
import { Product } from '../../common/datatypes/Product.js';
import { api } from '../../common/plt/Api.js';
import { FProductList } from './FProductList.js';
import { FvcProductEditor } from './FvcProductEditor.js';
import { FProduct } from './FProduct.js';
import { Shop } from '../../common/dba/Shop.js';

export class FOwnerProductList extends FProductList {
  #ownerId = null;
  #isBatchLoading = false;

  setOwnerId(ownerId) { this.#ownerId = ownerId; }

  onNewProductAddedInProductEditorContentFragment(fvcProductEditor) {
    // Not possible because editor is alwasy working with some product.
  }

  onRequestEditProduct(productId) {
    let v = new View();
    let f = new FvcProductEditor();
    f.setDelegate(this);
    f.setProduct(Shop.getProduct(productId));
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Product editor");
  }

  _createInfoFragment(id) {
    let f = new FProduct();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setProductId(id);
    f.setSizeType(Shop.getItemLayoutType());
    return f;
  }

  _asyncLoadFrontItems() {}
  _asyncLoadBackItems() {
    if (this.#isBatchLoading) {
      return;
    }
    let tagIds = this._dataSource.getTagIdsForProductListFragment(this);
    let url = "api/shop/products?";
    let params = [];
    for (let id of tagIds) {
      params.push("tag=" + id);
    }
    if (this.#ownerId) {
      params.push("owner_id=" + this.#ownerId);
    }
    let fromId = this._getIdRecord().getLastId();
    if (fromId) {
      params.push("before_id=" + fromId);
    }
    url += params.join("&");
    this.#isBatchLoading = true;
    api.asyncRawCall(url, r => this.#onProductsRRR(r));
  }

  #onProductsRRR(responseText) {
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
};
