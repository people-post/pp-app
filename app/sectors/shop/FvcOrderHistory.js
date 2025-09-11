(function(shop) {
class FvcOrderHistory extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fList = new shop.FSupplierOrderList();
    this._fList.setDelegate(this);
    this.setChild("list", this._fList);
  }

  initFromUrl(urlParam) {
    super.initFromUrl(urlParam);
    this._fList.initFromUrl(urlParam);
  }

  getUrlParamString() { return this._fList.getUrlParamString(); }

  scrollToTop() { this._fList.scrollToItemIndex(0); }
  onScrollFinished() { this._fList.onScrollFinished(); }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }
};

shop.FvcOrderHistory = FvcOrderHistory;
}(window.shop = window.shop || {}));
