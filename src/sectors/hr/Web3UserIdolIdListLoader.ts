import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import { Account } from '../../common/dba/Account.js';

export class Web3UserIdolIdListLoader extends LongListIdLoader {
  #idRecord = new UniLongListIdRecord();
  #userId: string | null = null;
  #isBusy = false;

  getUserId(): string | null { return this.#userId; }
  getIdRecord(): UniLongListIdRecord { return this.#idRecord; }

  setUserId(id: string | null): void {
    this.#userId = id;
    this.#idRecord.clear();
  }

  asyncLoadFrontItems(): void {}
  asyncLoadBackItems(): void {
    if (this.#isBusy) {
      return;
    }
    this.#isBusy = true;
    this.#asyncLoadIdols().then(() => this.#markComplete());
  }

  async #asyncLoadIdols(): Promise<void> {
    if (!this.#userId || !Account) {
      return;
    }
    // For Web3, get idol IDs from the account if it's the current user
    if (Account.getId() === this.#userId) {
      const accountWithIdols = Account as unknown as { asyncGetIdolIds?: () => Promise<string[]> };
      if (accountWithIdols.asyncGetIdolIds) {
        let ids = await accountWithIdols.asyncGetIdolIds();
        for (let id of ids) {
          this.#idRecord.appendId(id);
        }
      }
    } else {
      // For other users, we might need to load from API
      // TODO: Implement API call to get user's idol IDs
    }
  }

  #markComplete(): void {
    this.#isBusy = false;
    this.#idRecord.markComplete();
    const delegate = this._delegate as { onIdUpdatedInLongListIdLoader?: (loader: LongListIdLoader) => void };
    if (delegate.onIdUpdatedInLongListIdLoader) {
      delegate.onIdUpdatedInLongListIdLoader(this);
    }
  }
}
