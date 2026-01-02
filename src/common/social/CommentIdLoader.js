import { LongListIdLoader } from '../plt/LongListIdLoader.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';
import { SocialItemId } from '../datatypes/SocialItemId.js';
import { Blog } from '../dba/Blog.js';

export class CommentIdLoader extends LongListIdLoader {
  #isBatchLoading = false;
  #threadId = null; // SocialItemId
  #hashtagIds = [];
  #idRecord = new UniLongListIdRecord();

  getIdRecord() { return this.#idRecord; }

  setThreadId(id, hashtagIds) {
    this.#threadId = id;
    this.#hashtagIds = hashtagIds;
    this.#idRecord.clear();
  }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() {
    if (this.#isBatchLoading) {
      return;
    }
    this.#isBatchLoading = true;
    let url = "api/social/comments";
    let fd = new FormData();
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
    api.asyncRawPost(url, fd, r => this.#onLoadRRR(r));
  }

  #onLoadRRR(responseText) {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInController(this, response.error);
    } else {
      let ds = response.data.comments;
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
