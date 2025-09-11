(function(pdb) {
class Web3Owner extends pdb.Web3User {
  // Note: This file is version sensitive, shall be backward compatible
  static #VERSION = '1.0';

  #pinServerSigPath =
      [ dat.Wallet.T_PURPOSE.NFSC001, dat.Wallet.T_COIN.NFSC001, 0, 0, 0 ];

  // TODO: Clearly define isValid and isAuthenticated
  isValid() { return !!this._getData('version'); }
  isAuthenticated() { return this._hasData(); }
  isWebOwner() { return this.isAuthenticated(); }
  isFollowing(userId) { return this.hasIdol(userId); }
  isIdolOf(user) { return this.isValid() && user.hasIdol(this.getId()); }

  getId() { return this._getData("uuid"); }
  getNickname() { return this._getDataOrDefault("profile", {}).nickname; }
  getUserNickname(userId, defaultName) { return userId; }
  getPreferredLanguage() { return null; }

  getPublicKey() {
    return ext.Utilities.uint8ArrayToHex(
        dba.Keys.getMlDsa44(this.#pinServerSigPath));
  }

  asyncFollow(userId) {
    this.#asyncFollow(userId).then(
        () => fwk.Events.trigger(plt.T_DATA.USER_PROFILE));
  }

  asyncUnfollow(userId) {
    this.#asyncUnfollow(userId).then(
        () => fwk.Events.trigger(plt.T_DATA.USER_PROFILE));
  }

  asyncReload() {}

  reset(data) {
    super.reset(data);
    fwk.Events.trigger(plt.T_DATA.USER_PROFILE);
  }

  static loadFromStorage() {
    let s = sessionStorage.getItem(C.STORAGE.KEY.PROFILE);
    return new Web3Owner(s ? JSON.parse(s) : null);
  }

  saveToStorage() {
    sessionStorage.setItem(C.STORAGE.KEY.PROFILE,
                           JSON.stringify(this.#toLtsJsonData()));
  }

  async asyncUploadFile(file) {
    const a = glb.web3Storage.getAgent(this.getId());
    const msg = new Uint8Array(await file.arrayBuffer());
    const sig = await dba.Keys.signUint8Array(this.#pinServerSigPath, msg);
    return await a.asUploadFile(file, this.getId(), sig);
  }

  async asyncUploadJson(data) {
    const a = glb.web3Storage.getAgent(this.getId());
    const msg = JSON.stringify(data);
    const sig = await dba.Keys.ed25519Sign(this.#pinServerSigPath, msg);
    return await a.asUploadJson(msg, this.getId(), sig);
  }

  async asyncLike(key) {
    let d = await this.asyncFindMark(key);
    if (!d) {
      d = {comments : []};
    }
    if (d.like) {
      // Already liked
      return;
    }
    d.like = true;
    await this.#asyncMark(key, d, []);
  }

  async asyncUnlike(key) {
    let d = await this.asyncFindMark(key);
    if (!d) {
      // Already unliked
      return;
    }
    if (!d.like) {
      // Already unliked
      return;
    }
    d.like = false;
    await this.#asyncMark(key, d, []);
  }

  async asyncComment(key, postInfo, refCids) {
    let d = await this.asyncFindMark(key);
    if (!d) {
      d = {comments : []};
    }
    d.comments.unshift(postInfo);
    await this.#asyncMark(key, d, refCids);
  }

  async asyncUpdateProfile(d, newCids) {
    this._setData("profile", d);
    await this.#asyncPublish(newCids);
  }

  async #asyncFollow(userId) {
    let idolInfo =
        {timestamp : Date.now(), type : "USER", id : userId, nickname : null};
    let dIdx = await this._asyncGetOrInitIdolRoot();
    dIdx.idols.unshift(idolInfo);
    await this.#asyncUpdateIdols(dIdx);
  }

  async #asyncUnfollow(userId) {
    let dIdx = await this._asyncGetOrInitIdolRoot();
    dIdx.idols = dIdx.idols.filter(i => i.id != userId);
    await this.#asyncUpdateIdols(dIdx);
  }

  async #asyncMark(key, markInfo, refCids) {
    let dRoot = await this._asyncGetOrInitMarkRoot();

    // TODO: Consider "folding" cases
    dRoot.marks[key] = markInfo;

    let newCids = [...refCids ];
    let cid = this._getData("marks");

    cid = await this.asyncUploadJson(dRoot);
    this._setData("marks", cid);
    newCids.push(cid);

    await this.#asyncPublish(newCids);
  }

  async asyncPost(postInfo, refCids) {
    if (!this.isValid()) {
      // TODO: Handle new user case
      throw "Root record not found";
    }

    // TODO: Better way to modify attribute
    postInfo.timestamp = Date.now();

    let newCids = [...refCids ];

    let dIdx = await this._asyncGetOrInitPostRoot();
    dIdx.posts.unshift(postInfo);

    let cid = this._getData("posts");

    // TODO: Fold if needed
    // if (dIdx.posts.length > 1000) {
    //}

    // let dInfo = {};
    // dInfo.timestamp = Date.now();
    // dInfo.cid = await this.asyncUploadJson(dIdx);
    // newCids.push(dInfo.cid);

    // Upload master list file
    cid = await this.asyncUploadJson(dIdx);
    this._setData("posts", cid);
    newCids.push(cid);

    await this.#asyncPublish(newCids);
  }

  #toLtsJsonData() {
    let d = {
      uuid : this.getId(),
      profile : this._getDataOrDefault("profile", {}),
      idols : this._getDataOrDefault("idols", null),
      posts : this._getDataOrDefault("posts", null),
      marks : this._getDataOrDefault("marks", null)
    };
    d.version = this.constructor.#VERSION;
    return d;
  }

  async #asyncUpdateIdols(dIdx) {
    let newCids = [];
    let cid = this._getData("idols");
    cid = await this.asyncUploadJson(dIdx);
    this._setData("idols", cid);
    newCids.push(cid);

    await this.#asyncPublish(newCids);
  }

  async #asyncPublish(addCids) {
    let pinCids = [...addCids ];
    // _cid is an internal value created in glb.web3Resolver.asyncResolve()
    let cid = this._getData("_cid");
    cid = await this.asyncUploadJson(this.#toLtsJsonData());
    this._setData("_cid", cid);
    pinCids.push(cid);

    let sig = await dba.Keys.ed25519Sign(this.#pinServerSigPath, cid);
    await glb.web3Publisher.asyncPublish(cid, this.getId(), sig);

    const msg = JSON.stringify({cids : pinCids});
    sig = await dba.Keys.ed25519Sign(this.#pinServerSigPath, msg);
    const a = glb.web3Storage.getAgent(this.getId());
    // TODO: Separate other pin update urls
    await a.asPinJson(msg, this.getId(), sig);

    this.saveToStorage();
  }
};

pdb.Web3Owner = Web3Owner;
}(window.pdb = window.pdb || {}));
