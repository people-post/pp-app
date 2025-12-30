
export class IdolWeb3PostIdLoader extends plt.LongListIdLoader {
  #loaders = [];

  constructor() {
    super();
    // TODO: Replace by user followed user ids
    let loader = new blog.OwnerWeb3PostIdLoader();
    loader.setOwnerId(dba.Web3Config.getGuestIdolId());
    loader.setDelegate(this);
    this.#loaders.push(loader);
  }

  getIdRecord() {
    // TODO: Create new "Union" idRecord class
    return this.#loaders[0].getIdRecord();
  }

  onIdUpdatedInLongListIdLoader(loader) {
    this._delegate.onIdUpdatedInLongListIdLoader(this);
  }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() { this.#loaders[0].asyncLoadBackItems(); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.IdolWeb3PostIdLoader = IdolWeb3PostIdLoader;
}
