import { LongListIdRecord } from './LongListIdRecord.js';
import { SingleLongListIdRecord } from './SingleLongListIdRecord.js';

export class UniLongListIdRecord extends LongListIdRecord {
  #record = new SingleLongListIdRecord();

  isEmpty() { return this.#record.isEmpty(); }
  isFrontComplete() { return true; }
  isBackComplete() { return this.#record.isComplete(); }

  isComplete() { return this.#record.isComplete(); }

  has(id) { return this.#record.has(id); }

  getFirstIdx() { return 0; }
  getId(index) { return this.#record.getId(index); }
  getLastId() { return this.#record.getLastId(); }
  getIds() { return this.#record.getIds(); }
  getIndexOf(id) {
    let idx = this.#record.getIndexOf(id);
    return idx < 0 ? null : idx;
  }

  appendId(id) { this.#record.appendId(id); }

  markComplete() { this.#record.markComplete(); }

  findIdBefore(id) { return this.#record.findIdBefore(id); }
  findIdAfter(id) { return this.#record.findIdAfter(id); }

  removeId(id) { this.#record.removeId(id); }

  clear() { this.#record.clear(); }
};


