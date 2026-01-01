import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import { api } from '../../common/plt/Api.js';
import { Groups } from '../../common/dba/Groups.js';
import { Blog } from '../../common/dba/Blog.js';

export class FilteredPostIdLoader extends LongListIdLoader {
  #isBatchLoading = false;
  #tagId = null;
  #idRecord;

  constructor() {
    super();
    this.#idRecord = new UniLongListIdRecord();
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
      url += "&before_id=" + SocialItemId.fromEncodedStr(fromId).getValue();
    }
    let t = Groups.getTag(this.#tagId);
    if (t) {
      url += "&owner_id=" + t.getOwnerId();
    }
    api.asyncRawCall(url, r => this.#onPostsRRR(r));
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
          let p = Blog.updatePostData(d);
          this.#idRecord.appendId(p.getSocialId().toEncodedStr());
        }
      } else {
        this.#idRecord.markComplete();
      }
      this._delegate.onIdUpdatedInLongListIdLoader(this);
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FilteredPostIdLoader = FilteredPostIdLoader;
}
