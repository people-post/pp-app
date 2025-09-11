(function(srch) {
class FLocalUserSearch extends srch.FSearch {
  constructor() {
    super();
    this._userIds = null;
  }

  setUserIds(ids) { this._userIds = ids; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILES:
      this._clearCache();
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _doSearch(key) {
    if (this._userIds) {
      return this.#applyFilter(key);
    } else {
      this._delegate.onLocalUserSearchFragmentRequestFetchUserIds(this);
      return null;
    }
  }

  #makeResultFromUserId(userId) {
    // TODO: This return is a hack result
    let nickname = dba.Account.getUserNickname(userId, "...");
    return {
      id : userId,
      type : dat.SocialItem.TYPE.USER,
      title : {
        elements : [ {
          prefix : nickname,
          keyword : "",
          postfix : "",
        } ]
      },
      content : {elements : []}
    };
  }

  #applyFilter(key) {
    let items = [];
    if (key && key.length) {
      let lKey = key.toLowerCase();
      for (let id of this._userIds) {
        if (this.#isUserMatch(id, lKey)) {
          items.push(this.#makeResultFromUserId(id));
        }
      }
    } else {
      for (let id of this._userIds) {
        items.push(this.#makeResultFromUserId(id));
      }
    }
    return new dat.SearchResult(items);
  }

  #isUserMatch(userId, lKey) {
    let u = dba.Users.get(userId);
    if (u) {
      for (let n of [u.getNickname(), u.getUsername()]) {
        if (n.toLowerCase().indexOf(lKey) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};

srch.FLocalUserSearch = FLocalUserSearch;
}(window.srch = window.srch || {}));
