import { BiLongListIdRecord } from '../../common/datatypes/BiLongListIdRecord.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import { Blog } from '../../common/dba/Blog.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Users } from '../../common/dba/Users.js';

export class OwnerPostIdLoader extends LongListIdLoader {
  #idRecord = new BiLongListIdRecord();
  #ownerId = null;
  #isBatchLoadingFront = false;
  #isBatchLoadingBack = false;
  #tFrom = null;
  #tTo = null;
  #tagIds = [];

  getOwnerId() { return this.#ownerId; }

  setOwnerId(id) { this.#ownerId = id; }
  setAnchorPostId(id) {
    this.#idRecord.clear();
    this.#idRecord.appendId(id.toEncodedStr());
  }
  setTagIds(ids) { this.#tagIds = ids; }
  setFilter(tFrom, tTo) {
    this.#tFrom = tFrom;
    this.#tTo = tTo;
  }

  getIdRecord() { return this.#idRecord; }

  asyncLoadFrontItems() {
    if (this.#isBatchLoadingFront) {
      return;
    }
    let fromId = this.#idRecord.getFirstId();
    if (!fromId) {
      this.#markFrontComplete();
      return;
    }
    this.#isBatchLoadingFront = true;
    let url = "api/blog/articles?";
    let params = [];
    params.push("after_id=" +
                SocialItemId.fromEncodedStr(fromId).getValue());
    for (let id of this.#tagIds) {
      params.push("tag=" + id);
    }
    if (this.#ownerId) {
      params.push("owner_id=" + this.#ownerId);
    }
    if (this.#tFrom) {
      params.push("from=" + Math.round(this.#tFrom.getTime() / 1000));
    }
    if (this.#tTo) {
      params.push("to=" + Math.round(this.#tTo.getTime() / 1000));
    }
    url += params.join("&");
    api.asyncRawCall(url, r => this.#onFrontPostsRRR(r));
  }

  asyncLoadBackItems() {
    if (this.#isBatchLoadingBack) {
      return;
    }
    this.#isBatchLoadingBack = true;
    let url = "api/blog/articles?";
    let params = [];
    for (let id of this.#tagIds) {
      params.push("tag=" + id);
    }
    if (this.#ownerId) {
      params.push("owner_id=" + this.#ownerId);
    }
    let fromId = this.#idRecord.getLastId();
    if (fromId) {
      params.push("before_id=" +
                  SocialItemId.fromEncodedStr(fromId).getValue());
    }
    if (this.#tFrom) {
      params.push("from=" + Math.round(this.#tFrom.getTime() / 1000));
    }
    if (this.#tTo) {
      params.push("to=" + Math.round(this.#tTo.getTime() / 1000));
    }
    url += params.join("&");
    api.asyncRawCall(url, r => this.#onBackPostsRRR(r));
  }

  #addPinnedPostIds() {
    for (let id of this.#getPinnedPostIds().reverse()) {
      this.#idRecord.prependId(id);
    }
  }

  #markFrontComplete() {
    let r = this.#idRecord;
    r.markFrontComplete();
    if (r.isBackComplete() || !r.isEmpty()) {
      // Avoid adding too early so that back end mistakenly use the last id of
      // pinned articles as the anchor id
      this.#addPinnedPostIds();
    }
    this._delegate.onIdUpdatedInLongListIdLoader(this);
  }

  #markBackComplete() {
    this.#idRecord.markBackComplete();
    this._delegate.onIdUpdatedInLongListIdLoader(this);
  }

  #onFrontPostsRRR(responseText) {
    this.#isBatchLoadingFront = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInController(this, response.error);
    } else {
      let ds = response.data.articles;
      if (ds.length) {
        let r = this.#idRecord;
        for (let d of ds) {
          let p = Blog.updatePostData(d);
          r.prependId(p.getSocialId().toEncodedStr());
        }
        this._delegate.onIdUpdatedInLongListIdLoader(this);
      } else {
        this.#markFrontComplete();
      }
    }
  }

  #onBackPostsRRR(responseText) {
    this.#isBatchLoadingBack = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInController(this, response.error);
    } else {
      let ds = response.data.articles;
      if (ds.length) {
        let r = this.#idRecord;
        if (r.isEmpty() && r.isFrontComplete()) {
          this.#addPinnedPostIds();
        }
        let pids = this.#getPinnedPostIds();
        for (let d of ds) {
          let p = Blog.updatePostData(d);
          let sid = p.getSocialId().toEncodedStr();
          // To avoid same post display twice near pinned articles
          if (!r.isEmpty() || pids.indexOf(sid) < 0) {
            r.appendId(sid);
          }
        }
        this._delegate.onIdUpdatedInLongListIdLoader(this);
      } else {
        this.#markBackComplete();
        let r = this.#idRecord;
        if (r.isEmpty() && r.isFrontComplete()) {
          this.#addPinnedPostIds();
        }
      }
    }
  }

  #getPinnedPostIds() {
    let ids = [];
    if (this.#ownerId == WebConfig.getOwnerId()) {
      ids = Blog.getPinnedPostIds();
    } else {
      let u = Users.get(this.#ownerId);
      if (u) {
        let c = u.getBlogConfig();
        if (c) {
          ids = c.getPinnedPostIds();
        }
      }
    }
    return ids.map(id => id.toEncodedStr());
  }
}
