import { LongListIdLoader } from './LongListIdLoader.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';

export class ConstListIdLoader extends LongListIdLoader {
  #idRecord = new UniLongListIdRecord();

  getIdRecord() { return this.#idRecord; }

  setIds(ids) {
    this.#idRecord.clear();
    for (let id of ids) {
      this.#idRecord.appendId(id);
    }
    this.#idRecord.markComplete();
  }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() {}
};
