(function(dat) {
class Post extends dat.SocialItem {
  isRepost() { return false; }
  isEditable() { return false; }
  isSocialable() { return true; }
  isPinnable() { return false; }

  getOwnerId() { return null; }
  getAuthorId() { return null; }
  getLinkTo() { return null; }
  getLinkToSocialId() { return null; }
  getSocialId() {
    return new dat.SocialItemId(this.getId(), this.getSocialItemType());
  }
  getVisibility() { return null; }
  getCommentTags() { return []; }
  getHashtagIds() { return []; }
  getTaggedCommentIds(tagId) { return []; }
};

dat.Post = Post;
}(window.dat = window.dat || {}));
