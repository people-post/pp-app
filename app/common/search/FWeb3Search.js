(function(srch) {
class FWeb3Search extends srch.FSearch {
  #config;

  constructor() {
    super();
    this.#config = new dat.SearchConfig();
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
      Libp2PPeerId.peerIdFromString(s);
      return true;
    } catch (e) {
      return false;
    }
  }

  #asyncUserSearch(key) {
    if (this.#isUserId(key)) {
      dba.Users.asyncGet(key).then(d => this.#onSearchUserRRR(d, key));
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
    let r = new dat.SearchResult(results);
    this._updateResult(key, r);
  }
};

srch.FWeb3Search = FWeb3Search;
}(window.srch = window.srch || {}));
