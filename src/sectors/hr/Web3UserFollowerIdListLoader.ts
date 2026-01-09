import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';

export class Web3UserFollowerIdListLoader extends LongListIdLoader {
  #idRecord = new UniLongListIdRecord();
  #userId: string | null = null;

  getUserId(): string | null { return this.#userId; }
  getIdRecord(): UniLongListIdRecord { return this.#idRecord; }

  setUserId(id: string | null): void { this.#userId = id; }

  asyncLoadFrontItems(): void {}
  asyncLoadBackItems(): void { this.#idRecord.markComplete(); }
}
