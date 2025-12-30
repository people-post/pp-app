
export class Web3UserFollowerIdListLoader extends plt.LongListIdLoader {
  #idRecord = new dat.UniLongListIdRecord();
  #userId;

  getUserId() { return this.#userId; }
  getIdRecord() { return this.#idRecord; }

  setUserId(id) { this.#userId = id; }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() { this.#idRecord.markComplete(); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hr = window.hr || {};
  window.hr.Web3UserFollowerIdListLoader = Web3UserFollowerIdListLoader;
}
