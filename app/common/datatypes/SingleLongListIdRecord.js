import Utilities from '../../lib/ext/Utilities.js';

export class SingleLongListIdRecord {
  #ids = [];
  #isComplete = false;

  isEmpty() { return this.#ids.length == 0; }
  isComplete() { return this.#isComplete; }

  has(id) { return this.#ids.indexOf(id) >= 0; }

  getId(index) { return this.#ids[index]; }
  getLastId() { return this.#ids[this.#ids.length - 1]; }
  getIds() { return this.#ids; }
  getIndexOf(id) { return this.#ids.indexOf(id); }

  size() { return this.#ids.length; }

  appendId(id) { this.#ids.push(id); }

  markComplete() { this.#isComplete = true; }

  findIdBefore(id) { return Utilities.findItemBefore(this.#ids, id); }
  findIdAfter(id) { return Utilities.findItemAfter(this.#ids, id); }

  removeId(id) {
    let idx = this.#ids.indexOf(id);
    if (idx < 0) {
      return;
    }
    this.#ids.splice(idx, 1);
  }

  clear() {
    this.#ids = [];
    this.#isComplete = false;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.SingleLongListIdRecord = SingleLongListIdRecord;
}
