(function(dat) {
class JournalIssueSection {
  #data;
  #ids = [];

  constructor(data) {
    this.#data = data;
    for (let d of data.item_ids) {
      this.#ids.push(new dat.SocialItemId(d.id, d.type));
    }
  }

  hasItem() { return this.#ids.length > 0; }
  containsPost(id) { return this.#ids.some(sid => sid.getValue() == id); }

  getId() { return this.#data.id; }
  getPostSocialIds() { return this.#ids; }
};

dat.JournalIssueSection = JournalIssueSection;
}(window.dat = window.dat || {}));
