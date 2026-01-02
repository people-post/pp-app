import { SocialItemId } from './SocialItemId.js';

interface JournalIssueSectionData {
  id?: string;
  item_ids?: Array<{ id: string; type: string }>;
  [key: string]: unknown;
}

export class JournalIssueSection {
  #data: JournalIssueSectionData;
  #ids: SocialItemId[] = [];

  constructor(data: JournalIssueSectionData) {
    this.#data = data;
    if (data.item_ids) {
      for (const d of data.item_ids) {
        this.#ids.push(new SocialItemId(d.id, d.type));
      }
    }
  }

  hasItem(): boolean {
    return this.#ids.length > 0;
  }

  containsPost(id: string): boolean {
    return this.#ids.some((sid) => sid.getValue() == id);
  }

  getId(): string | undefined {
    return this.#data.id;
  }

  getPostSocialIds(): SocialItemId[] {
    return this.#ids;
  }
}

