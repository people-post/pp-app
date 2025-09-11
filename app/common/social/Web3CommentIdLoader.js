(function(socl) {
class Web3CommentIdLoader extends plt.LongListIdLoader {
  #isBatchLoading = false;
  #threadId = null; // SocialItemId
  #hashtagIds = [];
  #idRecord = new dat.UniLongListIdRecord();
  #isBusy = false;

  getIdRecord() { return this.#idRecord; }

  setThreadId(id, hashtagIds) {
    this.#threadId = id;
    this.#hashtagIds = hashtagIds;
    this.#idRecord.clear();
  }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() {
    if (this.#isBusy) {
      return;
    }
    this.#isBusy = true;
    // TODO: Improve to progressive load
    this.#asyncLoadAllComments()
        .then(() => this.#markComplete())
        .catch(e => this.#onError(e));
  }

  #markComplete() {
    this.#isBusy = false;
    this.#idRecord.markComplete();
    this._delegate.onIdUpdatedInLongListIdLoader(this);
  }

  #onError(e) {
    console.log(e);
    this.#isBusy = false;
  }

  async #asyncLoadAllComments() {
    let uids = await dba.Account.asyncGetIdolIds();
    // Include owner himself
    uids.push(dba.Account.getId());

    let key = this.#threadId.getValue();
    let u, m;
    for (let id of uids) {
      let u = await dba.Users.asyncGet(id);
      let m = await u.asyncFindMark(key);
      if (m) {
        for (let i of m.comments) {
          this.#idRecord.appendId(
              new dat.SocialItemId(i.cid, i.type).toEncodedStr());
        }
      }
    }
  }
};

socl.Web3CommentIdLoader = Web3CommentIdLoader;
}(window.socl = window.socl || {}));
