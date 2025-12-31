import { LongListIdLoader } from '../plt/LongListIdLoader.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';
import { SocialItemId } from '../datatypes/SocialItemId.js';
import { Account } from '../dba/Account.js';
import { Users } from '../dba/Users.js';

export class Web3CommentIdLoader extends LongListIdLoader {
  #isBatchLoading = false;
  #threadId = null; // SocialItemId
  #hashtagIds = [];
  #idRecord = new UniLongListIdRecord();
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
    let uids = await Account.asyncGetIdolIds();
    // Include owner himself
    uids.push(Account.getId());

    let key = this.#threadId.getValue();
    let u, m;
    for (let id of uids) {
      let u = await Users.asyncGet(id);
      let m = await u.asyncFindMark(key);
      if (m) {
        for (let i of m.comments) {
          this.#idRecord.appendId(
              new SocialItemId(i.cid, i.type).toEncodedStr());
        }
      }
    }
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.socl = window.socl || {};
  window.socl.Web3CommentIdLoader = Web3CommentIdLoader;
}
