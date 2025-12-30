import { Post } from './Post.js';
import { RemoteFile } from './RemoteFile.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';

export class ArticleBase extends Post {
  #files = [];
  #attachments = [];

  constructor(data) {
    super(data);
    if (data.files) {
      for (let f of data.files) {
        this.#files.push(new RemoteFile(f));
      }
    }

    if (data.attachments) {
      for (let d of data.attachments) {
        this.#attachments.push(new RemoteFile(d));
      }
    }
  }

  isDraft() { throw "isDraft is required in ArticleBase"; }
  isRepost() {
    return this._data.link_to &&
           (this._data.link_type == null ||
            this._data.link_type == SocialItem.TYPE.FEED_ARTICLE ||
            this._data.link_type == SocialItem.TYPE.ARTICLE) &&
           this.#isEmpty();
  }
  isQuotePost() { return this._data.link_to && !this.isRepost(); }
  getLinkTo() { return this._data.link_to; }
  getLinkType() { return this._data.link_type; }
  getLinkToSocialId() {
    return new SocialItemId(this._data.link_to, this._data.link_type);
  }
  getSocialItemType() { return SocialItem.TYPE.ARTICLE; }
  getTitle() { return this._data.title; }
  getContent() { return this._data.content; }
  getFiles() { return this.#files; }
  getAttachment() { return this.#attachments[0]; }
  getVisibility() { return this._data.visibility; }
  getOwnerId() { return this._data.owner_id; }
  getAuthorId() { return this._data.author_id; }
  getTagIds() { return this._data.tag_ids; }
  getPublishMode() { return this._data.publish_mode; }
  getPendingAuthorTagIds() { return this._data.author_tag_ids; }
  getPendingAuthorNewTagNames() { return this._data.author_new_tag_names; }
  getPendingNewTagNames() { return this._data.new_tag_names; }
  getClassification() { return this._data.classification; }
  getUpdateTime() { return new Date(this._data.updated_at * 1000); }
  getExternalQuoteUrl() {
    if (this._data.link_type == SocialItem.TYPE.URL) {
      return this._data.link_to;
    } else {
      return null;
    }
  }

  #isEmpty() { return this._data.title == null && this._data.content == null; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.ArticleBase = ArticleBase;
}
