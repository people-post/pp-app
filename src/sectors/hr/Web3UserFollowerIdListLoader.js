import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';

export class Web3UserFollowerIdListLoader extends LongListIdLoader {
  #idRecord = new UniLongListIdRecord();
  #userId;

  getUserId() { return this.#userId; }
  getIdRecord() { return this.#idRecord; }

  setUserId(id) { this.#userId = id; }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() { this.#idRecord.markComplete(); }
};
