import { JournalConfigTagged } from './JournalConfigTagged.js';

interface JournalData {
  name?: string;
  description?: string;
  template_id?: string;
  template_data?: unknown;
  [key: string]: unknown;
}

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

  getName(): string | undefined {
    return this.#data.name;
  }

  getDescription(): string | undefined {
    return this.#data.description;
  }

  getTemplateId(): string | undefined {
    return this.#data.template_id;
  }

  getTemplateConfig(): JournalConfigTagged | null {
    return this.#config;
  }

  #initConfig(type: string | undefined, data: unknown): JournalConfigTagged | null {
    let c: JournalConfigTagged | null = null;
    switch (type) {
      case Journal.T_TEMPLATE_ID.TAGGED:
        c = new JournalConfigTagged(data as Record<string, unknown>);
        break;
      default:
        break;
    }
    return c;
  }
}

