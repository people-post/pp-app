import { UniLongListIdRecord } from './UniLongListIdRecord.js';

export class UniSegmentedLongListIdRecord extends UniLongListIdRecord {
  // UniSegmentedLongListIdRecord only provided an extra attribute
  #nextSegmentId = 0;

  getNextSegmentId(): number {
    return this.#nextSegmentId;
  }

  setNextSegmentId(id: number): void {
    this.#nextSegmentId = id;
  }

  clear(): void {
    super.clear();
    this.#nextSegmentId = 0;
  }
}

