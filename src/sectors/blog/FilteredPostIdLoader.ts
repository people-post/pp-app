import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import { Groups } from '../../common/dba/Groups.js';
import { Blog } from '../../common/dba/Blog.js';
import { Api } from '../../common/plt/Api.js';

export class FilteredPostIdLoader extends LongListIdLoader {
  #isBatchLoading = false;
  #tagId: string | null = null;
  #idRecord: UniLongListIdRecord;

  constructor() {
    super();
    this.#idRecord = new UniLongListIdRecord();
  }

  getIdRecord(): UniLongListIdRecord { return this.#idRecord; }

  setTagId(id: string | null): void { this.#tagId = id; }

  asyncLoadFrontItems(): void {}
  asyncLoadBackItems(): void {
    if (this.#isBatchLoading || !this.#tagId) {
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
    Api.asyncRawCall(url, r => this.#onPostsRRR(r));
  }

  #onPostsRRR(responseText: string): void {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText) as { error?: string; data?: { articles: unknown[] } };
    if (response.error) {
      this.onRemoteErrorInController(this, response.error);
    } else if (response.data) {
      let ds = response.data.articles;
      if (ds.length) {
        for (let d of ds) {
          let p = Blog.updatePostData(d);
          this.#idRecord.appendId(p.getSocialId().toEncodedStr());
        }
      } else {
        this.#idRecord.markComplete();
      }
      const delegate = this._delegate as { onIdUpdatedInLongListIdLoader?: (loader: LongListIdLoader) => void };
      if (delegate.onIdUpdatedInLongListIdLoader) {
        delegate.onIdUpdatedInLongListIdLoader(this);
      }
    }
  }
}
