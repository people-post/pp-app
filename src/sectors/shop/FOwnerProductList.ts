import { View } from '../../lib/ui/controllers/views/View.js';
import { Product } from '../../common/datatypes/Product.js';
import { FProductList } from './FProductList.js';
import { FvcProductEditor } from './FvcProductEditor.js';
import { FProduct } from './FProduct.js';
import { Shop } from '../../common/dba/Shop.js';
import { Api } from '../../common/plt/Api.js';

interface OwnerProductListDataSource {
  getTagIdsForProductListFragment(f: FOwnerProductList): string[];
}

export class FOwnerProductList extends FProductList {
  #ownerId: string | null = null;
  #isBatchLoading: boolean = false;
  protected _dataSource!: OwnerProductListDataSource;

  setOwnerId(ownerId: string | null): void { this.#ownerId = ownerId; }

  onNewProductAddedInProductEditorContentFragment(_fvcProductEditor: FvcProductEditor): void {
    // Not possible because editor is alwasy working with some product.
  }

  onRequestEditProduct(productId: string): void {
    let v = new View();
    let f = new FvcProductEditor();
    f.setDelegate(this);
    f.setProduct(Shop.getProduct(productId));
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Product editor");
  }

  _createInfoFragment(id: string): FProduct {
    let f = new FProduct();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setProductId(id);
    f.setSizeType(Shop.getItemLayoutType());
    return f;
  }

  _asyncLoadFrontItems(): void {}
  _asyncLoadBackItems(): void {
    if (this.#isBatchLoading) {
      return;
    }
    let tagIds = this._dataSource.getTagIdsForProductListFragment(this);
    let url = "api/shop/products?";
    let params: string[] = [];
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
    Api.asyncRawCall(url, (r: string) => this.#onProductsRRR(r));
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
