(function(dat) {
class JournalConfigTagged {
  #data;

  constructor(data) { this.#data = data; }

  getTagIds() { return this.#data.tag_ids; }
  getPlaceholder() { return this.#data.placeholder; }
};

dat.JournalConfigTagged = JournalConfigTagged;
}(window.dat = window.dat || {}));
