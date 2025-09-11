(function(dat) {
class CommentTag {
  #data;
  #sidComments = [];

  constructor(data) {
    this.#data = data;
    for (let d of data.comment_ids) {
      this.#sidComments.push(new dat.SocialItemId(d.id, d.type));
    }
  }

  getTagId() { return this.#data.tag_id; };
  getCommentSocialIds() { return this.#sidComments; }
};

dat.CommentTag = CommentTag;
}(window.dat = window.dat || {}));
