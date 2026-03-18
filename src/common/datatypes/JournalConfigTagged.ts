import type { JournalConfigTaggedData } from '../../types/backend2.js';

export class JournalConfigTagged {
  #data: JournalConfigTaggedData;

  constructor(data: JournalConfigTaggedData) {
    this.#data = data;
  }

  getTagIds(): string[] {
    return this.#data.tag_ids;
  }

  getPlaceholder(): string | null {
    return this.#data.placeholder;
  }
}

