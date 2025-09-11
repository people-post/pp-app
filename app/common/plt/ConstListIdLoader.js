(function(plt) {
class ConstListIdLoader extends plt.LongListIdLoader {
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

plt.ConstListIdLoader = ConstListIdLoader;
}(window.plt = window.plt || {}));
