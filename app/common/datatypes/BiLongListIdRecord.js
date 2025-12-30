import { LongListIdRecord } from './LongListIdRecord.js';
import { SingleLongListIdRecord } from './SingleLongListIdRecord.js';

export class BiLongListIdRecord extends LongListIdRecord {
  // Front list goes backwards: index of 0, 1, 2 means global index -1 -2 -3
  #rFront = new SingleLongListIdRecord();
  #rBack = new SingleLongListIdRecord();

  isEmpty() { return this.#rFront.isEmpty() && this.#rBack.isEmpty(); }
  isFrontComplete() { return this.#rFront.isComplete(); }
  isBackComplete() { return this.#rBack.isComplete(); }

  has(id) { return this.#rFront.has(id) || this.#rBack.has(id); }

  getFirstIdx() { return -this.#rFront.size(); }
  getId(idx) {
    // Negative global idx to local idx is l_idx = -g_idx - 1
    return idx < 0 ? this.#rFront.getId(-idx - 1) : this.#rBack.getId(idx);
  }
  getFirstId() {
    return this.#rFront.isEmpty() ? this.#rBack.getId(0)
                                  : this.#rFront.getLastId();
  }
  getLastId() {
    return this.#rBack.isEmpty() ? this.#rFront.getId(0)
                                 : this.#rBack.getLastId();
  }
  getIndexOf(id) {
    let idx = this.#rFront.getIndexOf(id);
    if (idx < 0) {
      // Not found, try rBack
      idx = this.#rBack.getIndexOf(id);
      return idx < 0 ? null : idx;
    }
    // Front local idx to global idx is g_idx = -l_idx - 1
    return -idx - 1;
  }

  prependId(id) { this.#rFront.appendId(id); }
  appendId(id) { this.#rBack.appendId(id); }

  findIdBefore(id) {
    let r = this.#rBack.findIdBefore(id);
    return r ? r : this.#rFront.findIdAfter(id);
  }
  findIdAfter(id) {
    let r = this.#rBack.findIdAfter(id);
    return r ? r : this.#rFront.findIdBefore(id);
  }

  markFrontComplete() { this.#rFront.markComplete(); }
  markBackComplete() { this.#rBack.markComplete(); }

  removeId(id) {
    this.#rFront.removeId(id);
    this.#rBack.removeId(id);
  }

  clear() {
    this.#rFront.clear();
    this.#rBack.clear();
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.BiLongListIdRecord = BiLongListIdRecord;
}
