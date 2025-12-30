import { Post } from './Post.js';
import { SocialItem } from './SocialItem.js';

export class EmptyPost extends Post {
  static TYPE = {DELETED : "DELETED", PERMISSION: "PERMISSION"};

  isSocialable() { return false; }

  getSocialItemType() { return SocialItem.TYPE.INVALID; }
  getErrorCode() { return this._data.err_code; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.EmptyPost = EmptyPost;
}
