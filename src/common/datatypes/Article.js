import { ArticleBase } from './ArticleBase.js';
import { OgpData } from './OgpData.js';
import { SocialItemId } from './SocialItemId.js';

export class Article extends ArticleBase {
  #mTagComments = new Map();

  constructor(data) {
    super(data);
    this.#initCommentTags(data.comment_tags);
  }

  isDraft() { return false; }
  isPinnable() { return true; }
  isEditable() {
    if (this.isRepost()) {
      return false;
    }

    let files = this.getFiles();
    return files && files.every(f => !f.isActive());
  }

  getOgpData() {
    let d = new OgpData();
    d.setTitle(this.getTitle());
    d.setType("website");
    d.setImageUrl("");
    d.setUrl(this.#getOgpUrl());
    d.setDescription(this.getContent());
    d.setCreationTime(this.getCreationTime());
    d.setUserId(this.getOwnerId());
    d.setFiles(this.getFiles());
    return d;
  }

  getCommentTags() { return Array.from(this.#mTagComments.keys()); }
  getTaggedCommentIds(tagId) {
    return this.#mTagComments.has(tagId) ? this.#mTagComments.get(tagId) : [];
  }
  getHashtagIds() {
    return this._data.hashtag_ids ? this._data.hashtag_ids : [];
  }
  getReplyToSocialId() {
    if (this._data.reply_to) {
      return new SocialItemId(this._data.reply_to.id,
                                  this._data.reply_to.type);
    }
    return null;
  }

  #getOgpUrl() {
    return "https://" + window.location.hostname +
           "/?id=" + this.getSocialId().toEncodedStr();
  }

  #initCommentTags(ds) {
    if (!ds) {
      return;
    }
    for (let ct of ds) {
      let sids = [];
      for (let d of ct.comment_ids) {
        sids.push(new SocialItemId(d.id, d.type));
      }
      this.#mTagComments.set(ct.tag_id, sids);
    }
  }
};
