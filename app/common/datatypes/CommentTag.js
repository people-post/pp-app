import { SocialItemId } from './SocialItemId.js';

export class CommentTag {
  #data;
  #sidComments = [];

  constructor(data) {
    this.#data = data;
    for (let d of data.comment_ids) {
      this.#sidComments.push(new SocialItemId(d.id, d.type));
    }
  }

  getTagId() { return this.#data.tag_id; };
  getCommentSocialIds() { return this.#sidComments; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.CommentTag = CommentTag;
}
