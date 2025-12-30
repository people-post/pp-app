
export class OwnerJournalIssueIdLoader extends plt.LongListIdLoader {
  #isBatchLoading = false;
  #idRecord = new dat.UniLongListIdRecord();

  getIdRecord() { return this.#idRecord; }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() {
    if (this.#isBatchLoading) {
      return;
    }
    this.#isBatchLoading = true;
    let url = "api/blog/journal_issues";
    let fromId = this.getIdRecord().getLastId();
    if (fromId) {
      url += "?before_id=" + dat.SocialItemId.fromEncodedStr(fromId).getValue();
    }
    plt.Api.asyncRawCall(url, r => this.#onIssuesRRR(r));
  }

  #onIssuesRRR(responseText) {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInController(this, response.error);
    } else {
      let ds = response.data.issues;
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.OwnerJournalIssueIdLoader = OwnerJournalIssueIdLoader;
}
