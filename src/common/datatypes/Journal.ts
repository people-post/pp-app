import { JournalConfigTagged } from './JournalConfigTagged.js';
import type { JournalConfigTaggedData, JournalData } from '../../types/backend2.js';

export class Journal {
  static readonly T_TEMPLATE_ID = {
    TAGGED: 'TAGGED', // Synced with backend
  } as const;

  #data: JournalData;
  #config: JournalConfigTagged | null = null;

  constructor(data: JournalData) {
    this.#data = data;
    this.#config = this.#initConfig(data.template_id, data.template_data);
  }

  getName(): string | null {
    return this.#data.name;
  }

  getDescription(): string | null {
    return this.#data.description;
  }

  getTemplateId(): string | null {
    return this.#data.template_id;
  }

  getTemplateConfig(): JournalConfigTagged | null {
    return this.#config;
  }

  #initConfig(type: string | null, data: unknown): JournalConfigTagged | null {
    let c: JournalConfigTagged | null = null;
    switch (type) {
      case Journal.T_TEMPLATE_ID.TAGGED:
        c = new JournalConfigTagged(data as JournalConfigTaggedData);
        break;
      default:
        break;
    }
    return c;
  }
}

