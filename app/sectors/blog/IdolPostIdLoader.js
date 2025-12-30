
class IdolPostIdLoader extends plt.LongListIdLoader {
  #isBatchLoading = false;
  #idRecord = new dat.UniLongListIdRecord();

  getIdRecord() { return this.#idRecord; }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() {
    if (this.#isBatchLoading) {
      return;
    }
    this.#isBatchLoading = true;
    let url = "api/blog/idol_articles";
    let fromId = this.getIdRecord().getLastId();
    if (fromId) {
      url += "?before_id=" + dat.SocialItemId.fromEncodedStr(fromId).getValue();
    }
    plt.Api.asyncRawCall(url, r => this.#onPostsRRR(r));
  }

  #onPostsRRR(responseText) {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInController(this, response.error);
    } else {
      let ds = response.data.articles;
      if (ds.length) {
        for (let d of ds) {
          let p = dba.Blog.updatePostData(d);
          this.getIdRecord().appendId(p.getSocialId().toEncodedStr());
        }
      } else {
        this.getIdRecord().markComplete();
      }
      this._delegate.onIdUpdatedInLongListIdLoader(this);
    }
  }
};

blog.IdolPostIdLoader = IdolPostIdLoader;
}(window.blog = window.blog || {}));
