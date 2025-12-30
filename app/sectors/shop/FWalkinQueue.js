import { FLongListLegacy } from '../../lib/ui/controllers/fragments/FLongListLegacy.js';
import { C } from '../../lib/framework/Constants.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { WalkinQueueItem } from '../../common/datatypes/WalkinQueueItem.js';

export class FWalkinQueue extends FLongListLegacy {
  constructor() {
    super();
    this._isReadOnly = false;
    this._isBatchLoading = false;
    this._branchId = null;
    this._supplierId = null;
  }

  initFromUrl(urlParam) {
    let id = urlParam.get(C.URL_PARAM.ID);
    if (id) {
      this.switchToItem(id);
    }
  }

  getUrlParamString() {
    if (this._currentId) {
      return C.URL_PARAM.ID + "=" + this._currentId;
    }
    return "";
  }

  shouldBufferedListClearBuffer(fBufferedList) {
    return this.#getIdRecord().isEmpty();
  }
  isItemSelectedInWalkinQueueItemFragment(fItem, itemId) {
    return this._currentId == itemId;
  }
  onClickInWalkinQueueItemFragment(fItem, itemId) { this.switchToItem(itemId); }
  onItemDeletedInWalkinQueueItemFragment(fItem) { this.reload(); }

  getSupplierId() { return this._supplierId; }
  getBranchId() { return this._branchId; }

  setSupplierId(id) {
    this._supplierId = id;
    this.#getIdRecord().clear();
  }
  setBranchId(id) {
    this._branchId = id;
    this.#getIdRecord().clear();
  }
  setReadOnly(b) { this._isReadOnly = b; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.WALKIN_QUEUE_ITEMS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _resetList() { this.#getIdRecord().clear(); }
  _isFullListLoaded() { return this.#getIdRecord().isComplete(); }
  _getIdRecord() { return this.#getIdRecord(); }
  _createItemFragment(itemIndex) {
    if (itemIndex < 0) {
      return null;
    }
    let id = this.#getIdRecord().getId(itemIndex);
    if (id) {
      return this._createInfoFragment(id);
    } else {
      if (!this._isFullListLoaded()) {
        this._asyncLoadItems();
      }
      return null;
    }
  }

  _createItemView(id) {
    let v = new View();
    let f = new shop.FvcWalkinQueueItem();
    f.setItemId(id);
    v.setContentFragment(f);
    return v;
  }

  _createInfoFragment(id) {
    let f = new shop.FWalkinQueueItem();
    f.setItemId(id);
    f.setLayoutType(shop.FWalkinQueueItem.T_LAYOUT.INFO);
    f.setEnableAction(!this._isReadOnly);
    f.setDataSource(this);
    f.setDelegate(this);
    return f;
  }

  _asyncLoadItems() {
    if (this._isBatchLoading) {
      return;
    }
    let url = "api/shop/queue";
    let fd = new FormData();
    fd.append("supplier_id", this._supplierId);
    if (this._branchId) {
      fd.append("branch_id", this._branchId);
    }
    let fromId = this.#getIdRecord().getLastId();
    if (fromId) {
      fd.append("before_id", fromId);
    }
    this._isBatchLoading = true;
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onQueueItemsRRR(d));
  }

  #onQueueItemsRRR(data) {
    this._isBatchLoading = false;
    if (data.items.length) {
      let items = data.items.map(i => new WalkinQueueItem(i));
      items.sort((a, b) => {
        if (a.getCreationTime() < b.getCreationTime()) {
          return 1;
        } else {
          return -1;
        }
      });
      for (let item of items) {
        this.#getIdRecord().appendId(item.getId());
        dba.WalkinQueue.update(item);
      }
    } else {
      this.#getIdRecord().markComplete();
    }
    this._fItems.onScrollFinished();
  }

  #getIdRecord() { return dba.WalkinQueue.getIdRecord(); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FWalkinQueue = FWalkinQueue;
}
