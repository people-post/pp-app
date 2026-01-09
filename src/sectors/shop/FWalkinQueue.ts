import { FLongListLegacy } from '../../lib/ui/controllers/fragments/FLongListLegacy.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { WalkinQueueItem } from '../../common/datatypes/WalkinQueueItem.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FvcWalkinQueueItem } from './FvcWalkinQueueItem.js';
import { FWalkinQueueItem } from './FWalkinQueueItem.js';
import { WalkinQueue } from '../../common/dba/WalkinQueue.js';
import { Api } from '../../common/plt/Api.js';
import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';

export class FWalkinQueue extends FLongListLegacy {
  private _isReadOnly = false;
  private _isBatchLoading = false;
  private _branchId: string | null = null;
  private _supplierId: string | null = null;

  constructor() {
    super();
    this._isReadOnly = false;
    this._isBatchLoading = false;
    this._branchId = null;
    this._supplierId = null;
  }

  initFromUrl(urlParam: URLSearchParams): void {
    let id = urlParam.get(URL_PARAM.ID);
    if (id) {
      this.switchToItem(id);
    }
  }

  getUrlParamString(): string {
    if (this._currentId) {
      return URL_PARAM.ID + "=" + this._currentId;
    }
    return "";
  }

  shouldBufferedListClearBuffer(_fBufferedList: unknown): boolean {
    return this.#getIdRecord().isEmpty();
  }
  isItemSelectedInWalkinQueueItemFragment(_fItem: FWalkinQueueItem, itemId: string): boolean {
    return this._currentId == itemId;
  }
  onClickInWalkinQueueItemFragment(_fItem: FWalkinQueueItem, itemId: string): void { this.switchToItem(itemId); }
  onItemDeletedInWalkinQueueItemFragment(_fItem: FWalkinQueueItem): void { this.reload(); }

  getSupplierId(): string | null { return this._supplierId; }
  getBranchId(): string | null { return this._branchId; }

  setSupplierId(id: string | null): void {
    this._supplierId = id;
    this.#getIdRecord().clear();
  }
  setBranchId(id: string | null): void {
    this._branchId = id;
    this.#getIdRecord().clear();
  }
  setReadOnly(b: boolean): void { this._isReadOnly = b; }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.WALKIN_QUEUE_ITEMS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _resetList(): void { this.#getIdRecord().clear(); }
  _isFullListLoaded(): boolean { return this.#getIdRecord().isComplete(); }
  _getIdRecord(): UniLongListIdRecord { return this.#getIdRecord(); }
  _createItemFragment(itemIndex: number): FWalkinQueueItem | null {
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

  _createItemView(id: string): View {
    let v = new View();
    let f = new FvcWalkinQueueItem();
    f.setItemId(id);
    v.setContentFragment(f);
    return v;
  }

  _createInfoFragment(id: string): FWalkinQueueItem {
    let f = new FWalkinQueueItem();
    f.setItemId(id);
    f.setLayoutType(FWalkinQueueItem.T_LAYOUT.INFO);
    f.setEnableAction(!this._isReadOnly);
    f.setDataSource(this);
    f.setDelegate(this);
    return f;
  }

  _asyncLoadItems(): void {
    if (this._isBatchLoading) {
      return;
    }
    let url = "api/shop/queue";
    let fd = new FormData();
    if (this._supplierId) {
      fd.append("supplier_id", this._supplierId);
    }
    if (this._branchId) {
      fd.append("branch_id", this._branchId);
    }
    let fromId = this.#getIdRecord().getLastId();
    if (fromId) {
      fd.append("before_id", fromId);
    }
    this._isBatchLoading = true;
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onQueueItemsRRR(d));
  }

  #onQueueItemsRRR(data: { items: unknown[] }): void {
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
        WalkinQueue.update(item);
      }
    } else {
      this.#getIdRecord().markComplete();
    }
    this._fItems.onScrollFinished();
  }

  #getIdRecord(): UniLongListIdRecord { return WalkinQueue.getIdRecord(); }
}

export default FWalkinQueue;
