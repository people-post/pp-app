interface JournalConfigTaggedData {
  tag_ids?: string[];
  placeholder?: string;
  [key: string]: unknown;
}

export class JournalConfigTagged {
  #data: JournalConfigTaggedData;

  constructor(data: JournalConfigTaggedData) {
    this.#data = data;
  }

  getTagIds(): string[] | undefined {
    return this.#data.tag_ids;
  }

  getPlaceholder(): string | undefined {
    return this.#data.placeholder;
  }
}

