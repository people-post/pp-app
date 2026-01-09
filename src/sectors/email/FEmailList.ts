import { FLongListLegacy } from '../../lib/ui/controllers/fragments/FLongListLegacy.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { T_DATA } from '../../common/plt/Events.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcEmail } from './FvcEmail.js';
import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class FEmailList extends FLongListLegacy {
  protected _currentId: string | null = null;

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
    return this._getIdRecord().isEmpty();
  }
  isEmailSelectedInEmailFragment(_fEmail: unknown, emailId: string): boolean {
    return this._currentId == emailId;
  }

  onEmailInfoClickedInEmailFragment(_fEmail: unknown, emailId: string): void {
    this.switchToItem(emailId);
  }
  onEmailViewRequestNavToEmail(emailId: string): void { this._currentId = emailId; }

  handleSessionDataUpdate(dataType: symbol, _data: unknown): void {
    switch (dataType) {
    case T_DATA.EMAIL_IDS:
      (this as any)._fItems.reload();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, _data);
  }

  _resetList(): void { this._getIdRecord().clear(); }

  _isFullListLoaded(): boolean { return this._getIdRecord().isComplete(); }

  protected _getIdRecord(): {isEmpty(): boolean; isComplete(): boolean; getId(index: number): string | null; clear(): void} {
    throw new Error("_getIdRecord is required in FEmailList");
  }

  protected _createInfoFragment(_id: string): Fragment {
    throw new Error("_createInfoFragment is not implemented");
  }
  _createItemFragment(itemIndex: number): Fragment | null {
    if (itemIndex < 0) {
      return null;
    }
    let id = this._getIdRecord().getId(itemIndex);
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
    let f = new FvcEmail();
    f.setEmailId(id);
    v.setContentFragment(f);
    return v;
  }

  _asyncLoadItems(): void {}
};
