export class UniSegmentedLongListIdRecord extends dat.UniLongListIdRecord {
  // UniSegmentedLongListIdRecord only provided an extra attribute
  #nextSegmentId = 0;

  getNextSegmentId() { return this.#nextSegmentId; }

  setNextSegmentId(id) { this.#nextSegmentId = id; }

  clear() {
    super.clear();
    this.#nextSegmentId = 0;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.UniSegmentedLongListIdRecord = UniSegmentedLongListIdRecord;
}
