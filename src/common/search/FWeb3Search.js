import { FSearch } from './FSearch.js';
import { SearchConfig } from '../datatypes/SearchConfig.js';
import { SearchResult } from '../datatypes/SearchResult.js';
import { Users } from '../dba/Users.js';
import { sys } from 'pp-api';

export class FWeb3Search extends FSearch {
  #config;

  constructor() {
    super();
    this.#config = new SearchConfig();
  }

  getConfig() { return this.#config; }

  setConfig(c) { this.#config = c; }

  _doSearch(key) {
    if (!key) {
      return null;
    }
    this.#asyncUserSearch(key);
    return null;
  }

  #isUserId(s) {
    try {
      sys.utl.peerIdFromString(s);
      return true;
    } catch (e) {
      return false;
    }
  }

  #asyncUserSearch(key) {
    if (this.#isUserId(key)) {
      Users.asyncGet(key).then(d => this.#onSearchUserRRR(d, key));
    } else {
      // TODO: Try name server to resolve names
      this.#onSearchRRR([], key);
    }
  }

  #onSearchUserRRR(u, key) {
    let sr = {
      id : u.getId(),
      type : "USER",
      title : {elements : [ {prefix : u.getNickname()} ]},
      content : {elements : []}
    };
    this.#onSearchRRR([ sr ], key);
  }

  #onSearchRRR(results, key) {
    let r = new SearchResult(results);
    this._updateResult(key, r);
  }
};
