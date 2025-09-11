(function(cart) {
class FvcHistory extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fList = new cart.FOrderList();
    this._fList.setDelegate(this);
    this.setChild("list", this._fList);
  }

  scrollToTop() { this._fList.scrollToItemIndex(0); }
  onScrollFinished() { this._fList.onScrollFinished(); }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }
};

cart.FvcHistory = FvcHistory;
}(window.cart = window.cart || {}));
