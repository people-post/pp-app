import { FSearch } from './FSearch.js';
import { T_DATA } from '../plt/Events.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { SearchResult } from '../datatypes/SearchResult.js';
import { Users } from '../dba/Users.js';
import { Account } from '../dba/Account.js';
import type { SearchResultData } from '../../types/backend2.js';

export interface FLocalUserSearchDelegate {
  onLocalUserSearchFragmentRequestFetchUserIds(f: FLocalUserSearch): void;
}

export class FLocalUserSearch extends FSearch {
  private _userIds: string[] | null = null;

  constructor() {
    super();
    this._userIds = null;
  }

  setUserIds(ids: string[] | null): void { this._userIds = ids; }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
      this._clearCache();
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _doSearch(key: string): SearchResult | null {
    if (this._userIds) {
      return this.#applyFilter(key);
    } else {
      this.getDelegate<FLocalUserSearchDelegate>()?.onLocalUserSearchFragmentRequestFetchUserIds(this);
      return null;
    }
  }

  #makeResultFromUserId(userId: string): SearchResultData {
    // TODO: This return is a hack result
    let nickname = Account.getUserNickname?.(userId, "...") || "...";
    return {
      id : userId,
      type : SocialItem.TYPE.USER,
      timestamp : null,
      title : {
        elements : [ {
          prefix : nickname,
          is_prefix_overflow : false,
          keyword : "",
          postfix : "",
          is_postfix_overflow : false,
        } ]
      },
      content : {elements : []}
    };
  }

  #applyFilter(key: string): SearchResult {
    let items: SearchResultData[] = [];
    if (key && key.length) {
      let lKey = key.toLowerCase();
      for (let id of this._userIds || []) {
        if (this.#isUserMatch(id, lKey)) {
          items.push(this.#makeResultFromUserId(id));
        }
      }
    } else {
      for (let id of this._userIds || []) {
        items.push(this.#makeResultFromUserId(id));
      }
    }
    return new SearchResult(items);
  }

  #isUserMatch(userId: string, lKey: string): boolean {
    let u = Users.get(userId);
    if (u) {
      for (let n of [u.getNickname(), u.getUsername()]) {
        if (n.toLowerCase().indexOf(lKey) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
}

export default FLocalUserSearch;
