import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FWalkinQueueItem } from './FWalkinQueueItem.js';
import { WalkinQueue } from '../../common/dba/WalkinQueue.js';

export class FvcWalkinQueueItem extends FScrollViewContent {
  #fItem;
  
  constructor() {
    super();
    this.#fItem = new FWalkinQueueItem();
    this.#fItem.setLayoutType(FWalkinQueueItem.T_LAYOUT.FULL);
    this.#fItem.setEnableAction(true);
    this.#fItem.setDataSource(this);
    this.#fItem.setDelegate(this);
    this.setChild("item", this.#fItem);
  }

  isItemSelectedInWalkinQueueItemFragment(fItem, itemId) { return false; }
  onItemDeletedInWalkinQueueItemFragment(fItem) {
    this._owner.onContentFragmentRequestPopView(this);
    WalkinQueue.clear();
  }

  setItemId(id) { this.#fItem.setItemId(id); }

  _renderContentOnRender(render) {
    this.#fItem.attachRender(render);
    this.#fItem.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcWalkinQueueItem = FvcWalkinQueueItem;
}
