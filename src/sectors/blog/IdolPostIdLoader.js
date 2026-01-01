import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import { api } from '../../common/plt/Api.js';
import { Blog } from '../../common/dba/Blog.js';

export class IdolPostIdLoader extends LongListIdLoader {
  #isBatchLoading = false;
  #idRecord = new UniLongListIdRecord();

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
      url += "?before_id=" + SocialItemId.fromEncodedStr(fromId).getValue();
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
          this.getIdRecord().appendId(p.getSocialId().toEncodedStr());
        }
      } else {
        this.getIdRecord().markComplete();
      }
      this._delegate.onIdUpdatedInLongListIdLoader(this);
    }
  }
};
