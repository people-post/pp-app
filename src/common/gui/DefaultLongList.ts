import { FLongListLegacy } from '../../lib/ui/controllers/fragments/FLongListLegacy.js';
import { URL_PARAM } from '../constants/Constants.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class DefaultLongList extends FLongListLegacy {
  _isBatchLoading: boolean = false;
  _ids: string[] = [];
  _isIdsComplete: boolean = false;
  declare _currentId: string | null;

  initFromUrl(urlParam: URLSearchParams): void {
    // @ts-expect-error - URL_PARAM.ID may not be in type definition but exists at runtime
    let id = urlParam.get(URL_PARAM.ID);
    if (id) {
      this.switchToItem(id);
    }
  }

  getUrlParamString(): string {
    if (this._currentId) {
      // @ts-expect-error - URL_PARAM.ID may not be in type definition but exists at runtime
      return URL_PARAM.ID + "=" + this._currentId;
    }
    return "";
  }

  _isFullListLoaded(): boolean {
    return this._isIdsComplete;
  }

  _createItemFragment(itemIndex: number): Fragment | null {
    if (itemIndex < 0) {
      return null;
    }
    let id = this._ids[itemIndex];
    if (id) {
      return this._createInfoFragment(id);
    } else {
      if (!this._isIdsComplete) {
        this._asyncLoadItems();
      }
      return null;
    }
  }

  _resetList(): void {
    this._ids = [];
    this._isIdsComplete = false;
  }

  _createInfoFragment(_id: string): Fragment {
    throw "_createInfoFragment is not implemented";
  }

  _asyncLoadItems(): void {}
}
