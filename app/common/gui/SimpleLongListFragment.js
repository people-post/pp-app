import { FLongListLegacy } from '../../lib/ui/controllers/fragments/FLongListLegacy.js';
import { api } from '../../common/plt/Api.js';

export class SimpleLongListFragment extends FLongListLegacy {
  constructor() {
    super();
    // Use global namespace until DataObject.js is migrated
    this._idRecord = new dat.UniLongListIdRecord();
    this._isBatchLoading = false;
  }

  _isFullListLoaded() { return this._idRecord.isComplete(); }

  _createItemFragment(itemIndex) {
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

  _resetList() { this._idRecord.clear(); }

  #asyncLoadIds() {
    if (this._isBatchLoading) {
      return;
    }
    let fromId = this._idRecord.getLastId();
    this._isBatchLoading = true;
    let url = this._dataSource.getUrlForLongListFragment(this, fromId);
    api.asyncRawCall(url, r => this.#onLoadIdsRRR(r));
  }

  #onLoadIdsRRR(responseText) {
    this._isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this._owner.onRemoteErrorInFragment(this, response.error);
    } else {
      let ids = response.data.ids;
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
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.SimpleLongListFragment = SimpleLongListFragment;
}
