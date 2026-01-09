import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FWalkinQueueItem } from './FWalkinQueueItem.js';
import { WalkinQueue } from '../../common/dba/WalkinQueue.js';

export class FvcWalkinQueueItem extends FScrollViewContent {
  #fItem: FWalkinQueueItem;
  
  constructor() {
    super();
    this.#fItem = new FWalkinQueueItem();
    this.#fItem.setLayoutType(FWalkinQueueItem.T_LAYOUT.FULL);
    this.#fItem.setEnableAction(true);
    this.#fItem.setDataSource(this);
    this.#fItem.setDelegate(this);
    this.setChild("item", this.#fItem);
  }

  isItemSelectedInWalkinQueueItemFragment(_fItem: FWalkinQueueItem, _itemId: string): boolean { return false; }
  onItemDeletedInWalkinQueueItemFragment(_fItem: FWalkinQueueItem): void {
    // @ts-expect-error - owner may have this method
    this._owner?.onContentFragmentRequestPopView?.(this);
    WalkinQueue.clear();
  }

  setItemId(id: string): void { this.#fItem.setItemId(id); }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this.#fItem.attachRender(render);
    this.#fItem.render();
  }
}

export default FvcWalkinQueueItem;
