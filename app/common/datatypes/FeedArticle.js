import { Post } from './Post.js';
import { RemoteFile } from './RemoteFile.js';
import { SocialItem } from './SocialItem.js';

export class FeedArticle extends Post {
  #files = [];

  constructor(data) {
    super(data);
    if (data.files) {
      for (let f of data.files) {
        this.#files.push(new RemoteFile(f));
      }
    }
  }

  isSocialable() { return false; }
  getSocialItemType() { return SocialItem.TYPE.FEED_ARTICLE; }
  getTitle() { return this._data.title; }
  getContent() { return this._data.content; }
  getFiles() { return this.#files; }
  getOwnerId() { return this._data.owner_id; }
  getAuthorId() { return this._data.owner_id; }
  getUpdateTime() { return new Date(this._data.created_at * 1000); }
  getSourceUrl() { return this._data.url; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.FeedArticle = FeedArticle;
}
