import { FSearch } from './FSearch.js';
import { SearchConfig } from '../datatypes/SearchConfig.js';
import { SearchResult } from '../datatypes/SearchResult.js';
import Utilities from '../Utilities.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';

export class FGeneralSearch extends FSearch {
  #enableAddFeed = false;
  #config;

  constructor() {
    super();
    this.#config = new SearchConfig();
  }

  getConfig() { return this.#config; }

  enableAddFeed() { this.#enableAddFeed = true; }
  setConfig(c) { this.#config = c; }

  _doSearch(key) {
    if (!key) {
      return null;
    }
    if (key.indexOf('#') == 0) {
      this.#asyncHashtagSearch(key);
    } else if (Utilities.isOrderReferenceId(key)) {
      this.#asyncOrderSearch(key);
    } else if (this.#enableAddFeed && UtilitiesExt.isValidUrl(key)) {
      this.#asyncSearchFeed(key);
    } else {
      this.#asyncTextSearch(key, this.#config);
    }
    return null;
  }

  #asyncOrderSearch(key) {
    let id = Utilities.orderReferenceIdToOrderId(key);
    let url = "api/search/order?id=" + id;
    glb.api.asFragmentCall(this, url).then(d => this.#onSearchRRR(d, key));
  }

  #asyncHashtagSearch(key) {
    let k = key.split('#').join(' ');
    let url = "api/search/by_hashtag?key=" + encodeURIComponent(k);
    glb.api.asFragmentCall(this, url).then(d => this.#onSearchRRR(d, key));
  }

  #asyncSearchFeed(key) {
    let url = "api/search/feed?url=" + encodeURIComponent(key);
    glb.api.asFragmentCall(this, url).then(d => this.#onSearchRRR(d, key));
  }

  #asyncTextSearch(key, config) {
    let url = "api/search/by_text";
    let fd = new FormData();
    fd.append("key", key);
    fd.append("config", config.toJsonString());
    glb.api.asFragmentPost(this, url, fd)
        .then(d => this.#onSearchRRR(d, key));
  }

  #onSearchRRR(data, key) {
    let r = new SearchResult(data.results);
    this._updateResult(key, r);
  }
};
