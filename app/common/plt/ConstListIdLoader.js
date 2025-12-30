export class ConstListIdLoader extends plt.LongListIdLoader {
  #idRecord = new dat.UniLongListIdRecord();

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

// Backward compatibility
if (typeof window !== 'undefined') {
  window.plt = window.plt || {};
  window.plt.ConstListIdLoader = ConstListIdLoader;
}
