import { LongListIdLoader } from './LongListIdLoader.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';

export class ConstListIdLoader extends LongListIdLoader {
  #idRecord = new UniLongListIdRecord();

  getIdRecord(): UniLongListIdRecord {
    return this.#idRecord;
  }

  setIds(ids: string[]): void {
    this.#idRecord.clear();
    for (const id of ids) {
      this.#idRecord.appendId(id);
    }
    this.#idRecord.markComplete();
  }

  asyncLoadFrontItems(): void {}
  asyncLoadBackItems(): void {}
}

