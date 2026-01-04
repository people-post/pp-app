import { FLongListLegacy } from '../../lib/ui/controllers/fragments/FLongListLegacy.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

interface SimpleLongListFragmentDataSource {
  createInfoFragmentForLongListFragment(f: SimpleLongListFragment, id: string): Fragment | null;
  getUrlForLongListFragment(f: SimpleLongListFragment, fromId: string | null): string;
}

export class SimpleLongListFragment extends FLongListLegacy {
  declare _idRecord: UniLongListIdRecord;
  declare _isBatchLoading: boolean;

  protected declare _dataSource: SimpleLongListFragmentDataSource;

  constructor() {
    super();
    this._idRecord = new UniLongListIdRecord();
    this._isBatchLoading = false;
  }

  _isFullListLoaded(): boolean { return this._idRecord.isComplete(); }

  _createItemFragment(itemIndex: number): Fragment | null {
    if (itemIndex < 0) {
      return null;
    }
    let id = this._idRecord.getId(itemIndex);
    if (id) {
      return this._dataSource.createInfoFragmentForLongListFragment(this, id);
    } else {
      if (!this._isFullListLoaded()) {
        this.#asyncLoadIds();
      }
      return null;
    }
  }

  _resetList(): void { this._idRecord.clear(); }

  #asyncLoadIds(): void {
    if (this._isBatchLoading) {
      return;
    }
    let fromId = this._idRecord.getLastId() ?? null;
    this._isBatchLoading = true;
    let url = this._dataSource.getUrlForLongListFragment(this, fromId);
    (globalThis as any).api.asyncRawCall(url, (r: string) => this.#onLoadIdsRRR(r));
  }

  #onLoadIdsRRR(responseText: string): void {
    this._isBatchLoading = false;
    let response = JSON.parse(responseText) as { error?: unknown; data?: { ids: string[] } };
    if (response.error) {
      if (this._owner) {
        (this._owner as any).onRemoteErrorInFragment(this, response.error);
      }
    } else {
      let ids = response.data?.ids || [];
      if (ids.length) {
        for (let id of ids) {
          this._idRecord.appendId(id);
        }
      } else {
        this._idRecord.markComplete();
      }
      this._fItems.onScrollFinished();
    }
  }
}

