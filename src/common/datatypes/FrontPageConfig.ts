import { BriefPageConfig } from './BriefPageConfig.js';
import { JournalPageConfig } from './JournalPageConfig.js';
import { BlockchainPageConfig } from './BlockchainPageConfig.js';
import { FrontPageLayoutConfig } from './FrontPageLayoutConfig.js';
import { TriplePanelConfig } from './TriplePanelConfig.js';

interface FrontPageConfigData {
  template_id?: string;
  data?: unknown;
  layout?: { type_id?: string; [key: string]: unknown };
  [key: string]: unknown;
}

export class FrontPageConfig {
  // Synced with backend
  static readonly T_TEMPLATE = {
    BRIEF: 'BRIEF',
    JOURNAL: 'JOURNAL',
    BLOCKCHAIN: 'BLOCKCHAIN',
  } as const;

  #data: FrontPageConfigData;
  #cData: BriefPageConfig | JournalPageConfig | BlockchainPageConfig | null;
  #cLayout: FrontPageLayoutConfig | null;

  constructor(data: FrontPageConfigData) {
    this.#data = data;
    this.#cData = this.#initDataConfig(data.template_id, data.data);
    this.#cLayout = this.#initLayoutConfig(data.layout);
  }

  isLoginEnabled(): boolean {
    return this.#cData ? this.#cData.isLoginEnabled() : false;
  }

  getTemplateId(): string | undefined {
    return this.#data.template_id;
  }

  getTemplateConfig(): BriefPageConfig | JournalPageConfig | BlockchainPageConfig | null {
    return this.#cData;
  }

  getLayoutConfig(): FrontPageLayoutConfig | null {
    return this.#cLayout;
  }

  #initDataConfig(
    templateId: string | undefined,
    data: unknown
  ): BriefPageConfig | JournalPageConfig | BlockchainPageConfig | null {
    let obj: BriefPageConfig | JournalPageConfig | BlockchainPageConfig | null = null;
    switch (templateId) {
      case FrontPageConfig.T_TEMPLATE.BRIEF:
        obj = new BriefPageConfig(data as Record<string, unknown>);
        break;
      case FrontPageConfig.T_TEMPLATE.JOURNAL:
        obj = new JournalPageConfig(data as Record<string, unknown>);
        break;
      case FrontPageConfig.T_TEMPLATE.BLOCKCHAIN:
        obj = new BlockchainPageConfig(data as Record<string, unknown>);
        break;
      default:
        break;
    }
    return obj;
  }

  #initLayoutConfig(data: { type_id?: string; [key: string]: unknown } | undefined): FrontPageLayoutConfig | null {
    if (!data) {
      return null;
    }

    let obj: FrontPageLayoutConfig | null = null;
    switch (data.type_id) {
      case FrontPageLayoutConfig.T_LAYOUT.TRIPLE:
        obj = new TriplePanelConfig(data);
        break;
      default:
        break;
    }
    return obj;
  }
}

