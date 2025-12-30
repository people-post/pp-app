import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcOrderHistory extends FScrollViewContent {
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcOrderHistory = FvcOrderHistory;
}
