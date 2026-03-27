import { LongListIdLoader, LongListIdLoaderDelegate } from '../plt/LongListIdLoader.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';
import type { SocialItemId as SocialItemIdType } from '../../types/basic.js';
import { SocialItemId } from '../datatypes/SocialItemId.js';
import { Blog } from '../dba/Blog.js';
import { Api } from '../plt/Api.js';
import { CommentData } from '../../types/backend2.js';


interface ApiResponse {
  error?: unknown;
  data?: { comments: CommentData[] };
}

export class CommentIdLoader extends LongListIdLoader {
  #isBatchLoading = false;
  #threadId: SocialItemIdType | null = null;
  #hashtagIds: string[] = [];
  #idRecord = new UniLongListIdRecord();

  getIdRecord(): UniLongListIdRecord { return this.#idRecord; }

  setThreadId(id: SocialItemIdType, hashtagIds: string[]): void {
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
    if (!this.#threadId || !this.#threadId.isValid()) {
      return;
    }
    fd.append("target_id", this.#threadId.getValue() || "");
    fd.append("target_type", this.#threadId.getType() || "");
    for (let id of this.#hashtagIds) {
      fd.append("hashtag_ids", id);
    }
    let fromId = this.#idRecord.getLastId();
    if (fromId) {
      let beforeId = SocialItemId.fromEncodedStr(fromId)?.getValue();
      if (beforeId) {
        fd.append("before_id", beforeId);
      }
    }
    Api.asyncRawPost(url, fd, (r: string) => this.#onLoadRRR(r), null, null);
  }

  #onLoadRRR(responseText: string): void {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      this.onRemoteErrorInController(this, response.error);
    } else {
      let ds = response.data?.comments || [];
      if (ds.length) {
        for (let d of ds) {
          let p = Blog.updatePostData(d);
          if (p) {
            this.#idRecord.appendId(p.getSocialId().toEncodedStr());
          }
        }
      } else {
        this.#idRecord.markComplete();
      }
      const delegate = this.getDelegate<LongListIdLoaderDelegate>();
      delegate?.onIdUpdatedInLongListIdLoader?.(this);
    }
  }
}

export default CommentIdLoader;
