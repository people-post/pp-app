(function(blog) {
class FilteredPostIdLoader extends plt.LongListIdLoader {
  #isBatchLoading = false;
  #tagId = null;
  #idRecord;

  constructor() {
    super();
    this.#idRecord = new dat.UniLongListIdRecord();
  }

  getIdRecord() { return this.#idRecord; }

  setTagId(id) { this.#tagId = id; }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() {
    if (this.#isBatchLoading) {
      return;
    }
    this.#isBatchLoading = true;
    let url = "api/blog/articles?&tag=" + this.#tagId;
    let fromId = this.#idRecord.getLastId();
    if (fromId) {
      url += "&before_id=" + dat.SocialItemId.fromEncodedStr(fromId).getValue();
    }
    let t = dba.Groups.getTag(this.#tagId);
    if (t) {
      url += "&owner_id=" + t.getOwnerId();
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
          this.#idRecord.appendId(p.getSocialId().toEncodedStr());
        }
      } else {
        this.#idRecord.markComplete();
      }
      this._delegate.onIdUpdatedInLongListIdLoader(this);
    }
  }
};

blog.FilteredPostIdLoader = FilteredPostIdLoader;
}(window.blog = window.blog || {}));
