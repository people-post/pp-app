export class JournalConfigTagged {
  #data;

  constructor(data) { this.#data = data; }

  getTagIds() { return this.#data.tag_ids; }
  getPlaceholder() { return this.#data.placeholder; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.JournalConfigTagged = JournalConfigTagged;
}
