import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';

export class Post extends SocialItem {
  isRepost() { return false; }
  isEditable() { return false; }
  isSocialable() { return true; }
  isPinnable() { return false; }

  getOwnerId() { return null; }
  getAuthorId() { return null; }
  getLinkTo() { return null; }
  getLinkToSocialId() { return null; }
  getSocialId() {
    return new SocialItemId(this.getId(), this.getSocialItemType());
  }
  getVisibility() { return null; }
  getCommentTags() { return []; }
  getHashtagIds() { return []; }
  getTaggedCommentIds(tagId) { return []; }
};
