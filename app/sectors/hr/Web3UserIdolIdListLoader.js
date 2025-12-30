import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';

export class Web3UserIdolIdListLoader extends plt.LongListIdLoader {
  #idRecord = new UniLongListIdRecord();
  #userId;
  #isBusy = false;

  getUserId() { return this.#userId; }
  getIdRecord() { return this.#idRecord; }

  setUserId(id) {
    this.#userId = id;
    this.#idRecord.clear();
  }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() {
    if (this.#isBusy) {
      return;
    }
    this.#isBusy = true;
    this.#asyncLoadIdols().then(() => this.#markComplete());
  }

  async #asyncLoadIdols() {
    let u = await dba.Users.asyncGet(this.#userId);
    if (u) {
      let ids = await u.asyncGetIdolIds();
      for (let id of ids) {
        this.#idRecord.appendId(id);
      }
    }
  }

  #markComplete() {
    this.#isBusy = false;
    this.#idRecord.markComplete();
    this._delegate.onIdUpdatedInLongListIdLoader(this);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hr = window.hr || {};
  window.hr.Web3UserIdolIdListLoader = Web3UserIdolIdListLoader;
}
