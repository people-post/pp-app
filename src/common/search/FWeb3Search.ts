import { FSearch } from './FSearch.js';
import { SearchConfig } from '../datatypes/SearchConfig.js';
import { SearchResult } from '../datatypes/SearchResult.js';
import { Users } from '../dba/Users.js';
import { sys } from 'pp-api';

export class FWeb3Search extends FSearch {
  #config: SearchConfig;

  constructor() {
    super();
    this.#config = new SearchConfig();
  }

  getConfig(): SearchConfig { return this.#config; }

  setConfig(c: SearchConfig): void { this.#config = c; }

  _doSearch(key: string): SearchResult | null {
    if (!key) {
      return null;
    }
    this.#asyncUserSearch(key);
    return null;
  }

  #isUserId(s: string): boolean {
    try {
      sys.utl.peerIdFromString(s);
      return true;
    } catch (_e) {
      return false;
    }
  }

  #asyncUserSearch(key: string): void {
    if (this.#isUserId(key)) {
      Users.asyncGet(key).then(d => this.#onSearchUserRRR(d, key));
    } else {
      // TODO: Try name server to resolve names
      this.#onSearchRRR([], key);
    }
  }

  #onSearchUserRRR(u: ReturnType<typeof Users.get>, key: string): void {
    let sr = {
      id : u.getId(),
      type : "USER",
      title : {elements : [ {prefix : u.getNickname()} ]},
      content : {elements : []}
    };
    this.#onSearchRRR([ sr ], key);
  }

  #onSearchRRR(results: unknown[], key: string): void {
    let r = new SearchResult(results);
    this._updateResult(key, r);
  }
}

export default FWeb3Search;
