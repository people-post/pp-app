import { UniSegmentedLongListIdRecord } from '../../common/datatypes/UniSegmentedLongListIdRecord.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import { Users } from '../../common/dba/Users.js';

export class OwnerWeb3PostIdLoader extends LongListIdLoader {
  #idRecord = new UniSegmentedLongListIdRecord();
  #ownerId: string | null = null;
  #isBusy = false;

  getOwnerId(): string | null { return this.#ownerId; }

  setOwnerId(id: string | null): void {
    this.#ownerId = id;
    this.#idRecord.clear();
  }

  getIdRecord(): UniSegmentedLongListIdRecord { return this.#idRecord; }

  asyncLoadFrontItems(): void {}
  asyncLoadBackItems(): void {
    if (this.#isBusy || !this.#ownerId) {
      return;
    }
    this.#isBusy = true;
    // Note onInfosRRR may trigger another round of asyncLoadBackItems
    // so that isBusy cannot be done in "finally"
    Users.asyncGet(this.#ownerId)
        .then(u => {
          const userWithLoad = u as unknown as { asyncLoadMorePostInfos?: (record: UniSegmentedLongListIdRecord) => Promise<unknown[]> };
          if (userWithLoad.asyncLoadMorePostInfos) {
            return userWithLoad.asyncLoadMorePostInfos(this.#idRecord);
          }
          return Promise.resolve([]);
        })
        .then(d => this.#onInfosRRR(d))
        .catch(e => this.#onInfosRRE(e));
  }

  #onInfosRRE(e: unknown): void {
    console.log(e);
    this.#isBusy = false;
    this.#markComplete();
  }

  #markComplete(): void {
    this.#idRecord.markComplete();
    const delegate = this._delegate as { onIdUpdatedInLongListIdLoader?: (loader: LongListIdLoader) => void };
    if (delegate.onIdUpdatedInLongListIdLoader) {
      delegate.onIdUpdatedInLongListIdLoader(this);
    }
  }

  #onInfosRRR(infos: unknown[]): void {
    this.#isBusy = false;
    if (!infos || infos.length < 1) {
      this.#markComplete();
      return;
    }

    for (let i of infos) {
      const infoWithCid = i as { cid?: string };
      if (infoWithCid.cid) {
        this.getIdRecord().appendId(
            new SocialItemId(infoWithCid.cid, SocialItem.TYPE.ARTICLE)
                .toEncodedStr());
      }
    }

    let segId = this.#idRecord.getNextSegmentId() + 1;
    this.#idRecord.setNextSegmentId(segId);

    const delegate = this._delegate as { onIdUpdatedInLongListIdLoader?: (loader: LongListIdLoader) => void };
    if (delegate.onIdUpdatedInLongListIdLoader) {
      delegate.onIdUpdatedInLongListIdLoader(this);
    }
  }
}
