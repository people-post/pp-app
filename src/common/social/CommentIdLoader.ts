import { LongListIdLoader } from '../plt/LongListIdLoader.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';
import { SocialItemId } from '../datatypes/SocialItemId.js';
import { Blog } from '../dba/Blog.js';

export class CommentIdLoader extends LongListIdLoader {
  #isBatchLoading = false;
  #threadId: SocialItemId | null = null;
  #hashtagIds: string[] = [];
  #idRecord = new UniLongListIdRecord();

  getIdRecord(): UniLongListIdRecord { return this.#idRecord; }

  setThreadId(id: SocialItemId, hashtagIds: string[]): void {
    this.#threadId = id;
    this.#hashtagIds = hashtagIds;
    this.#idRecord.clear();
  }

  asyncLoadFrontItems(): void {}
  asyncLoadBackItems(): void {
    if (this.#isBatchLoading) {
      return;
    }
    this.#isBatchLoading = true;
    let url = "api/social/comments";
    let fd = new FormData();
    if (!this.#threadId) return;
    fd.append("target_id", this.#threadId.getValue());
    fd.append("target_type", this.#threadId.getType());
    for (let id of this.#hashtagIds) {
      fd.append("hashtag_ids", id);
    }
    let fromId = this.#idRecord.getLastId();
    if (fromId) {
      fd.append("before_id",
                SocialItemId.fromEncodedStr(fromId).getValue());
    }
    // @ts-expect-error - api is a global
    api.asyncRawPost(url, fd, (r: string) => this.#onLoadRRR(r));
  }

  #onLoadRRR(responseText: string): void {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText) as { error?: unknown; data?: { comments: unknown[] } };
    if (response.error) {
      this.onRemoteErrorInController(this, response.error);
    } else {
      let ds = response.data?.comments || [];
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
}

export default CommentIdLoader;
