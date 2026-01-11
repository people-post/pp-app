import { LongListIdLoader } from '../plt/LongListIdLoader.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';
import { SocialItemId } from '../datatypes/SocialItemId.js';
import { Users } from '../dba/Users.js';
import { Account } from '../dba/Account.js';

export class Web3CommentIdLoader extends LongListIdLoader {
  #isBatchLoading = false;
  #threadId: SocialItemId | null = null;
  #hashtagIds: string[] = [];
  #idRecord = new UniLongListIdRecord();
  #isBusy = false;

  getIdRecord(): UniLongListIdRecord { return this.#idRecord; }

  setThreadId(id: SocialItemId, hashtagIds: string[]): void {
    this.#threadId = id;
    this.#hashtagIds = hashtagIds;
    this.#idRecord.clear();
  }

  asyncLoadFrontItems(): void {}
  asyncLoadBackItems(): void {
    if (this.#isBusy) {
      return;
    }
    this.#isBusy = true;
    // TODO: Improve to progressive load
    this.#asyncLoadAllComments()
        .then(() => this.#markComplete())
        .catch(e => this.#onError(e));
  }

  #markComplete(): void {
    this.#isBusy = false;
    this.#idRecord.markComplete();
    this._delegate.onIdUpdatedInLongListIdLoader(this);
  }

  #onError(e: unknown): void {
    console.log(e);
    this.#isBusy = false;
  }

  async #asyncLoadAllComments(): Promise<void> {
    if (!this.#threadId) return;
    let uids = await Account.asyncGetIdolIds?.() || [];
    // Include owner himself
    let accountId = Account.getId();
    if (accountId) {
      uids.push(accountId);
    }

    let key = this.#threadId.getValue();
    for (let id of uids) {
      let u = await Users.asyncGet(id);
      let m = await u.asyncFindMark(key);
      if (m && 'comments' in m && Array.isArray(m.comments)) {
        for (let i of m.comments as Array<{ cid: string; type: string }>) {
          this.#idRecord.appendId(
              new SocialItemId(i.cid, i.type).toEncodedStr());
        }
      }
    }
  }
}

export default Web3CommentIdLoader;
