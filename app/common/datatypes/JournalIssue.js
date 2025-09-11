(function(dat) {
class JournalIssue extends dat.JournalIssueBase {
  #mTagComments = new Map();

  constructor(data) {
    super(data);
    for (let ct of data.comment_tags) {
      let sids = [];
      for (let d of ct.comment_ids) {
        sids.push(new dat.SocialItemId(d.id, d.type));
      }
      this.#mTagComments.set(ct.tag_id, sids);
    }
  }

  getCommentTags() { return Array.from(this.#mTagComments.keys()); }
  getTaggedCommentIds(tagId) {
    return this.#mTagComments.has(tagId) ? this.#mTagComments.get(tagId) : [];
  }
};

dat.JournalIssue = JournalIssue;
}(window.dat = window.dat || {}));
