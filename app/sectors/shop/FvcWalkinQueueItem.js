(function(shop) {
class FvcWalkinQueueItem extends ui.FScrollViewContent {
  #fItem;
  
  constructor() {
    super();
    this.#fItem = new shop.FWalkinQueueItem();
    this.#fItem.setLayoutType(shop.FWalkinQueueItem.T_LAYOUT.FULL);
    this.#fItem.setEnableAction(true);
    this.#fItem.setDataSource(this);
    this.#fItem.setDelegate(this);
    this.setChild("item", this.#fItem);
  }

  isItemSelectedInWalkinQueueItemFragment(fItem, itemId) { return false; }
  onItemDeletedInWalkinQueueItemFragment(fItem) {
    this._owner.onContentFragmentRequestPopView(this);
    dba.WalkinQueue.clear();
  }

  setItemId(id) { this.#fItem.setItemId(id); }

  _renderContentOnRender(render) {
    this.#fItem.attachRender(render);
    this.#fItem.render();
  }
};

shop.FvcWalkinQueueItem = FvcWalkinQueueItem;
}(window.shop = window.shop || {}));
