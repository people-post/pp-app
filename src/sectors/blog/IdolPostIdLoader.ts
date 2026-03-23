import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import { Blog } from '../../common/dba/Blog.js';
import { Api } from '../../common/plt/Api.js';
import { ArticleData } from '../../types/backend2.js';

interface ApiResponse {
  error?: string;
  data?: { articles: ArticleData[] };
}

export class IdolPostIdLoader extends LongListIdLoader {
  #isBatchLoading = false;
  #idRecord = new UniLongListIdRecord();

  getIdRecord(): UniLongListIdRecord { return this.#idRecord; }

  asyncLoadFrontItems(): void {}
  asyncLoadBackItems(): void {
    if (this.#isBatchLoading) {
      return;
    }
    this.#isBatchLoading = true;
    let url = "api/blog/idol_articles";
    let fromId = this.getIdRecord().getLastId();
    if (fromId) {
      const id = SocialItemId.fromEncodedStr(fromId);
      if (id) {
        url += "?before_id=" + id.getValue();
      }
    }
    Api.asyncRawCall(url, r => this.#onPostsRRR(r));
  }

  #onPostsRRR(responseText: string): void {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText) as ApiResponse;
      if (response.error) {
        this.onRemoteErrorInController(this, response.error);
    } else if (response.data) {
      let ds = response.data.articles;
      if (ds.length) {
        for (let d of ds) {
          let p = Blog.updatePostData(d);
          if (!p) {
            continue;
          }
          this.getIdRecord().appendId(p.getSocialId().toEncodedStr());
        }
      } else {
        this.getIdRecord().markComplete();
      }
      const delegate = this._delegate as { onIdUpdatedInLongListIdLoader?: (loader: LongListIdLoader) => void };
      if (delegate.onIdUpdatedInLongListIdLoader) {
        delegate.onIdUpdatedInLongListIdLoader(this);
      }
    }
  }
}
