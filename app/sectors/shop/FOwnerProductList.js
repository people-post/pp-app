
export class FOwnerProductList extends shop.FProductList {
  #ownerId = null;
  #isBatchLoading = false;

  setOwnerId(ownerId) { this.#ownerId = ownerId; }

  onNewProductAddedInProductEditorContentFragment(fvcProductEditor) {
    // Not possible because editor is alwasy working with some product.
  }

  onRequestEditProduct(productId) {
    let v = new ui.View();
    let f = new shop.FvcProductEditor();
    f.setDelegate(this);
    f.setProduct(dba.Shop.getProduct(productId));
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Product editor");
  }

  _createInfoFragment(id) {
    let f = new shop.FProduct();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setProductId(id);
    f.setSizeType(dba.Shop.getItemLayoutType());
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
    plt.Api.asyncRawCall(url, r => this.#onProductsRRR(r));
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
          let p = new dat.Product(d);
          dba.Shop.updateProduct(p);
          this._getIdRecord().appendId(p.getId());
        }
      } else {
        this._getIdRecord().markComplete();
      }
      this.onScrollFinished();
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FOwnerProductList = FOwnerProductList;
}
