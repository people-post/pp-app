(function(pdb) {
class Web3User {
  #data;
  #dPosts;
  #dIdols;
  #dMarks;
  #iconUrl;

  constructor(data) { this.#data = data; }

  isFeed() { return false; }
  hasIdol(userId) {
    if (this.#dIdols) {
      return this.#dIdols.idols.some(i => i.id == userId);
    } else {
      this._asGetOrInitIdolRoot().then(
          d => fwk.Events.trigger(plt.T_DATA.WEB3_USER_IDOLS, this.getId()));
      return false;
    }
  }

  getId() { return this._getData("uuid"); }
  getUsername() { return this.getId(); }
  getProfile() { return this._getDataOrDefault("profile", {}); }
  getNickname() { return this._getDataOrDefault("profile", {}).nickname; }
  getIconUrl() {
    if (this.#iconUrl) {
      return this.#iconUrl;
    } else {
      let cid = this._getDataOrDefault("profile", {}).icon_cid;
      if (cid) {
        this.#asFetchIconImage(cid).then(
            () =>
                fwk.Events.trigger(plt.T_DATA.WEB3_USER_PROFILE, this.getId()));
        return null;
      } else {
        this.#iconUrl = "";
        return this.#iconUrl;
      }
    }
  }
  getLogoUrl() { return this.getIconUrl(); }
  getInfoImageUrl() { return null; }
  getDomainUrl() { return "N/A"; }
  getBackgroundColor() { return null; }
  getColorTheme() { return null; }
  getNIdols() {
    if (this.#dIdols) {
      return this.#dIdols.idols.length;
    } else {
      this._asGetOrInitIdolRoot().then(
          d => fwk.Events.trigger(plt.T_DATA.WEB3_USER_IDOLS, this.getId()));
      return 0;
    }
  }
  getNFollowers() { return 0; }
  getBriefBio() { return ""; }

  reset(data) {
    this.#data = data;
    this.#dPosts = null;
    this.#dMarks = null;
    this.#iconUrl = null;
  }

  async asyncGetIdolIds() {
    let d = await this._asGetOrInitIdolRoot();
    return d.idols.map(i => i.id);
  }

  async asyncFindMark(key) {
    if (!key) {
      return null;
    }

    let d = await this._asGetOrInitMarkRoot();
    return await this.#asFindMark("", key, d.marks);
  }

  async asyncLoadMorePostInfos(idRecord) {
    let dPosts = await this._asGetOrInitPostRoot();

    let segId = idRecord.getNextSegmentId();
    // TODO: Handle folded files
    if (segId > 0) {
      return Promise.resolve();
    } else {
      return dPosts.posts;
    }
  }

  _hasData() { return !!this.#data; }
  _getData(name) { return this.#data ? this.#data[name] : null; }

  _getDataOrDefault(name, vDefault) {
    let d = this._getData(name);
    return d ? d : vDefault;
  }

  async _asGetOrInitIdolRoot() {
    if (!this.#dIdols) {
      let cid = this._getData("idols");
      if (Utilities.isCid(cid)) {
        this.#dIdols = await plt.Api.asyncFetchCidJson(cid);
      } else {
        this.#dIdols = {idols : []};
      }
    }
    return this.#dIdols;
  }

  async _asGetOrInitPostRoot() {
    if (!this.#dPosts) {
      let cid = this._getData("posts");
      if (Utilities.isCid(cid)) {
        this.#dPosts = await plt.Api.asyncFetchCidJson(cid);
      } else {
        this.#dPosts = {posts : []};
      }
    }
    return this.#dPosts;
  }

  async _asGetOrInitMarkRoot() {
    if (!this.#dMarks) {
      let cid = this._getData("marks");
      if (Utilities.isCid(cid)) {
        this.#dMarks = await plt.Api.asyncFetchCidJson(cid);
      } else {
        this.#dMarks = {marks : {}};
      }
    }
    return this.#dMarks;
  }

  _setData(name, value) { this.#data[name] = value; }

  async #asFindMark(prefix, suffix, dMarks) {
    if (!dMarks) {
      return null;
    }

    let key = prefix + suffix;

    // Try direct child
    if (key in dMarks) {
      return dMarks[key];
    }

    // Try sub map
    if (suffix.length > 2) {
      key = suffix.slice(0, 2);
      if (key in dMarks) {
        let cid = dMarks[key];
        let d = await plt.Api.asyncFetchCidJson(cid);
        return await this.#asFindMark(prefix + key, suffix.slice(2), d.marks);
      }
    }
    return null;
  }

  async #asFetchIconImage(cid) {
    this.#iconUrl = await plt.Api.asyncFetchCidImage(cid);
  }
};

pdb.Web3User = Web3User;
}(window.pdb = window.pdb || {}));
