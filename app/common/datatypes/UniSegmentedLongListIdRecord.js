(function(dat) {
class UniSegmentedLongListIdRecord extends dat.UniLongListIdRecord {
  // UniSegmentedLongListIdRecord only provided an extra attribute
  #nextSegmentId = 0;

  getNextSegmentId() { return this.#nextSegmentId; }

  setNextSegmentId(id) { this.#nextSegmentId = id; }

  clear() {
    super.clear();
    this.#nextSegmentId = 0;
  }
};

dat.UniSegmentedLongListIdRecord = UniSegmentedLongListIdRecord;
}(window.dat = window.dat || {}));
