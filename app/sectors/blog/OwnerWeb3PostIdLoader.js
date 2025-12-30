import { UniSegmentedLongListIdRecord } from '../../common/datatypes/UniSegmentedLongListIdRecord.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';

export class OwnerWeb3PostIdLoader extends plt.LongListIdLoader {
  #idRecord = new UniSegmentedLongListIdRecord();
  #ownerId = null;
  #isBusy = false;

  getOwnerId() { return this.#ownerId; }

  setOwnerId(id) {
    this.#ownerId = id;
    this.#idRecord.clear();
  }

  getIdRecord() { return this.#idRecord; }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() {
    if (this.#isBusy) {
      return;
    }
    this.#isBusy = true;
    // Note onInfosRRR may trigger another round of asyncLoadBackItems
    // so that isBusy cannot be done in "finally"
    dba.Users.asyncGet(this.#ownerId)
        .then(u => u.asyncLoadMorePostInfos(this.#idRecord))
        .then(d => this.#onInfosRRR(d))
        .catch(e => this.#onInfosRRE(e));
  }

  #onInfosRRE(e) {
    console.log(e);
    this.#isBusy = false;
    this.#markComplete();
  }

  #markComplete() {
    this.#idRecord.markComplete();
    this._delegate.onIdUpdatedInLongListIdLoader(this);
  }

  #onInfosRRR(infos) {
    this.#isBusy = false;
    if (!infos || infos.length < 1) {
      this.#markComplete();
      return;
    }

    for (let i of infos) {
      this.getIdRecord().appendId(
          new SocialItemId(i.cid, SocialItem.TYPE.ARTICLE)
              .toEncodedStr());
    }

    let segId = this.#idRecord.getNextSegmentId() + 1;
    this.#idRecord.setNextSegmentId(segId);

    this._delegate.onIdUpdatedInLongListIdLoader(this);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.OwnerWeb3PostIdLoader = OwnerWeb3PostIdLoader;
}
