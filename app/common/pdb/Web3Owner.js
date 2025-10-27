(function(pdb) {
class Web3Owner extends pdb.Web3User {
  // Note: This file is version sensitive, shall be backward compatible
  static #VERSION = '1.0';

  #aPublishers = [];
  #aStorage = null;

  hasPublished() { return this._getDataOrDefault("edition", 0) > 0; }

  // TODO: Clearly define isAuthenticated
  isAuthenticated() { return this._hasData(); }
  isWebOwner() { return this.isAuthenticated(); }
  isFollowing(userId) { return this.hasIdol(userId); }
  isIdolOf(user) { return user.hasIdol(this.getId()); }

  getId() { return this._getData("uuid"); }
  getNickname() { return this._getDataOrDefault("profile", {}).nickname; }
  getUserNickname(userId, defaultName) { return userId; }
  getPreferredLanguage() { return null; }

  getPublicKey() {
    return this._dataSource.onWeb3OwnerRequestGetPublicKey(this);
  }

  setStorage(agent) { this.#aStorage = agent; }
  setPublishers(agents) { this.#aPublishers = agents; }

  asyncFollow(userId) {
    this.#asFollow(userId).then(() => this.#onProfileUpdated());
  }

  asyncUnfollow(userId) {
    this.#asUnfollow(userId).then(() => this.#onProfileUpdated());
  }

  asyncReload() {}

  reset(data) {
    super.reset(data);
    this.#onProfileUpdated();
  }

  loadCheckPoint() {
    let s = this._dataSource.onWeb3OwnerRequestLoadCheckPoint(this);
    this._reset(s ? JSON.parse(s) : null);
  }

  saveCheckPoint() {
    this._delegate.onWeb3OwnerRequestSaveCheckPoint(
        this, JSON.stringify(this.#toLtsJsonData()));
  }

  async asRegister(agent, name) {
    // TODO: Support optional peer key
    const msg = JSON.stringify({id : this.getId(), name : name});
    const sig = await this.#asSign(msg);
    await agent.asRegister(msg, this.getPublicKey(), sig);
  }

  async asUploadFile(file) {
    const token = await this.#aStorage.asGetUploadToken(this.getId());
    const sig = await this.#asSign(token);

    // TODO: Find file storage server
    let d;
    if (file.type.startsWith("image")) {
      d = await this.#aStorage.asUploadImage(file, this.getId(), token, sig);
    } else {
      d = await this.#aStorage.asUploadFile(file, this.getId(), token, sig);
    }
    return d.cid;
  }

  async asUploadJson(data) {
    // TODO: Find text storage server
    const msg = JSON.stringify(data);
    const sig = await this.#asSign(msg);
    return await this.#aStorage.asUploadJson(msg, this.getId(), sig);
  }

  async asLike(key) {
    let d = await this.asyncFindMark(key);
    if (!d) {
      d = {comments : []};
    }
    if (d.like) {
      // Already liked
      return;
    }
    d.like = true;
    await this.#asMark(key, d, []);
  }

  async asUnlike(key) {
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
    await this.#asMark(key, d, []);
  }

  async asComment(key, postInfo, refCids) {
    // TODO: refCids -> per type cidInfos
    let d = await this.asyncFindMark(key);
    if (!d) {
      d = {comments : []};
    }
    d.comments.unshift(postInfo);
    await this.#asMark(key, d, refCids);
  }

  async asUpdateProfile(d, newCids) {
    // TODO: newCids -> per type cidInfos
    this._setData("profile", d);
    await this.#asPublish({texts : newCids});
  }

  async asPublishPost(postInfo, refCids) {
    console.debug("Publishing post...");
    // TODO: refCids -> per type cidInfos

    // TODO: Better way to modify attribute
    postInfo.timestamp = Date.now();

    let newCids = [...refCids ];

    let dIdx = await this._asGetOrInitPostRoot();
    dIdx.posts.unshift(postInfo);

    let cid = this._getData("posts");

    // TODO: Fold if needed
    // if (dIdx.posts.length > 1000) {
    //}

    // let dInfo = {};
    // dInfo.timestamp = Date.now();
    // dInfo.cid = await this.asUploadJson(dIdx);
    // newCids.push(dInfo.cid);

    // Upload master list file
    console.debug("Uploading post list...");
    cid = await this.asUploadJson(dIdx);
    this._setData("posts", cid);
    newCids.push(cid);

    await this.#asPublish({texts : newCids});
  }

  #onProfileUpdated() {
    if (this._delegate) {
      this._delegate.onWeb3OwnerProfileUpdated(this);
    }
  }

  async #asSign(msg) {
    return this._delegate.asOnWeb3OwnerRequestSign(this, msg);
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
    d.edition = this._getDataOrDefault("edition", 0);
    return d;
  }

  async #asFollow(userId) {
    let idolInfo =
        {timestamp : Date.now(), type : "USER", id : userId, nickname : null};
    let dIdx = await this._asGetOrInitIdolRoot();
    dIdx.idols.unshift(idolInfo);
    await this.#asUpdateIdols(dIdx);
  }

  async #asUnfollow(userId) {
    let dIdx = await this._asGetOrInitIdolRoot();
    dIdx.idols = dIdx.idols.filter(i => i.id != userId);
    await this.#asUpdateIdols(dIdx);
  }

  async #asMark(key, markInfo, refCids) {
    // TODO: refCids -> per type cidInfos

    let dRoot = await this._asGetOrInitMarkRoot();

    // TODO: Consider "folding" cases
    dRoot.marks[key] = markInfo;

    let newCids = [...refCids ];
    let cid = this._getData("marks");

    cid = await this.asUploadJson(dRoot);
    this._setData("marks", cid);
    newCids.push(cid);

    await this.#asPublish({texts : newCids});
  }

  async #asUpdateIdols(dIdx) {
    let newCids = [];
    let cid = this._getData("idols");
    cid = await this.asUploadJson(dIdx);
    this._setData("idols", cid);
    newCids.push(cid);

    await this.#asPublish({texts : newCids});
  }

  async #asPublish(newCidInfo) {
    try {
      await this.#asDoPublish(newCidInfo);
    } catch (e) {
      this.loadCheckPoint();
      throw e;
    }
  }

  async #asDoPublish(newCidInfo) {
    console.debug("Publishing content...");
    // Increase edition number
    this._setData("edition", this._getDataOrDefault("edition", 0) + 1);

    console.debug("Uploading content...");
    let cid = await this.asUploadJson(this.#toLtsJsonData());

    // _cid is an internal value created in glb.web3Resolver.asResolve()
    this._setData("_cid", cid);
    newCidInfo.texts.push(cid);

    let sig = await this.#asSign(cid);
    console.debug("Publishing...");
    for (let a of this.#aPublishers) {
      await a.asPublish(cid, this.getId(), sig);
    }

    // TODO: Find all storage servers
    console.debug("Pinning content...");
    const msg = JSON.stringify({cids : newCidInfo.texts});
    sig = await this.#asSign(msg);
    await this.#aStorage.asPin(msg, this.getId(), sig);

    this.saveCheckPoint();
  }
};

pdb.Web3Owner = Web3Owner;
}(window.pdb = window.pdb || {}));
