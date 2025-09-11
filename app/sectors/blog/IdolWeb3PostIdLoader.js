(function(blog) {
class IdolWeb3PostIdLoader extends plt.LongListIdLoader {
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

blog.IdolWeb3PostIdLoader = IdolWeb3PostIdLoader;
}(window.blog = window.blog || {}));
