import { Post } from './Post.js';
import { SocialItem } from './SocialItem.js';

export class EmptyPost extends Post {
  static TYPE = {DELETED : "DELETED", PERMISSION: "PERMISSION"};

  isSocialable() { return false; }

  getSocialItemType() { return SocialItem.TYPE.INVALID; }
  getErrorCode() { return this._data.err_code; }
};
