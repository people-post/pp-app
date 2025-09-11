(function(shop) {
class FIdolProductList extends shop.FProductList {
  #isBatchLoading = false;

  _createInfoFragment(id) {
    let f = new shop.FProduct();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setProductId(id);
    f.setSizeType(dat.SocialItem.T_LAYOUT.LARGE);
    return f;
  }

  _asyncLoadFrontItems() {}
  _asyncLoadBackItems() {
    if (this.#isBatchLoading) {
      return;
    }
    this.#isBatchLoading = true;
    let url = "api/shop/idol_products";
    let fromId = this._getIdRecord().getLastId();
    if (fromId) {
      url += "?before_id=" + fromId;
    }
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

shop.FIdolProductList = FIdolProductList;
}(window.shop = window.shop || {}));
