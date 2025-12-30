import { JournalConfigTagged } from './JournalConfigTagged.js';

export class Journal {
  #data;
  #config;

  static T_TEMPLATE_ID = {
    TAGGED : "TAGGED", // Synced with backend
  };

  constructor(data) {
    this.#data = data;
    this.#config = this.#initConfig(data.template_id, data.template_data);
  }

  getName() { return this.#data.name; }
  getDescription() { return this.#data.description; }
  getTemplateId() { return this.#data.template_id; }
  getTemplateConfig() { return this.#config; }

  #initConfig(type, data) {
    let c = null;
    switch (type) {
    case this.constructor.T_TEMPLATE_ID.TAGGED:
      c = new JournalConfigTagged(data);
      break;
    default:
      break;
    }
    return c;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Journal = Journal;
}
