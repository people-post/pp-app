import { UniLongListIdRecord } from './UniLongListIdRecord.js';

export class UniSegmentedLongListIdRecord extends UniLongListIdRecord {
  // UniSegmentedLongListIdRecord only provided an extra attribute
  #nextSegmentId = 0;

  getNextSegmentId() { return this.#nextSegmentId; }

  setNextSegmentId(id) { this.#nextSegmentId = id; }

  clear() {
    super.clear();
    this.#nextSegmentId = 0;
  }
};
