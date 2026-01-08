import { FSearch } from './FSearch.js';
import { SearchConfig } from '../datatypes/SearchConfig.js';
import { SearchResult } from '../datatypes/SearchResult.js';
import { Utilities } from '../Utilities.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { Api } from '../plt/Api.js';

export class FGeneralSearch extends FSearch {
  #enableAddFeed: boolean = false;
  #config: SearchConfig;

  constructor() {
    super();
    this.#config = new SearchConfig();
  }

  getConfig(): SearchConfig { return this.#config; }

  enableAddFeed(): void { this.#enableAddFeed = true; }
  setConfig(c: SearchConfig): void { this.#config = c; }

  _doSearch(key: string): null {
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

  #asyncOrderSearch(key: string): void {
    let id = Utilities.orderReferenceIdToOrderId(key);
    let url = "api/search/order?id=" + id;
    Api.asFragmentCall(this, url).then((d: any) => this.#onSearchRRR(d, key));
  }

  #asyncHashtagSearch(key: string): void {
    let k = key.split('#').join(' ');
    let url = "api/search/by_hashtag?key=" + encodeURIComponent(k);
    Api.asFragmentCall(this, url).then((d: any) => this.#onSearchRRR(d, key));
  }

  #asyncSearchFeed(key: string): void {
    let url = "api/search/feed?url=" + encodeURIComponent(key);
    Api.asFragmentCall(this, url).then((d: any) => this.#onSearchRRR(d, key));
  }

  #asyncTextSearch(key: string, config: SearchConfig): void {
    let url = "api/search/by_text";
    let fd = new FormData();
    fd.append("key", key);
    fd.append("config", config.toJsonString());
    Api.asFragmentPost(this, url, fd)
        .then((d: any) => this.#onSearchRRR(d, key));
  }

  #onSearchRRR(data: any, key: string): void {
    let r = new SearchResult(data.results);
    this._updateResult(key, r);
  }
}
