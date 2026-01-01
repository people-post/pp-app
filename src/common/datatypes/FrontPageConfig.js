import { BriefPageConfig } from './BriefPageConfig.js';
import { JournalPageConfig } from './JournalPageConfig.js';
import { BlockchainPageConfig } from './BlockchainPageConfig.js';
import { FrontPageLayoutConfig } from './FrontPageLayoutConfig.js';
import { TriplePanelConfig } from './TriplePanelConfig.js';

export class FrontPageConfig {
  // Synced with backend
  static T_TEMPLATE = {
    BRIEF : "BRIEF",
    JOURNAL: "JOURNAL",
    BLOCKCHAIN: "BLOCKCHAIN",
  };

  #data;
  #cData;
  #cLayout;

  constructor(data) {
    this.#data = data;
    this.#cData = this.#initDataConfig(data.template_id, data.data);
    this.#cLayout = this.#initLayoutConfig(data.layout);
  }

  isLoginEnabled() { return this.#cData && this.#cData.isLoginEnabled(); }

  getTemplateId() { return this.#data.template_id; }
  getTemplateConfig() { return this.#cData; }
  getLayoutConfig() { return this.#cLayout; }

  #initDataConfig(templateId, data) {
    let obj = null;
    switch (templateId) {
    case this.constructor.T_TEMPLATE.BRIEF:
      obj = new BriefPageConfig(data);
      break;
    case this.constructor.T_TEMPLATE.JOURNAL:
      obj = new JournalPageConfig(data);
      break;
    case this.constructor.T_TEMPLATE.BLOCKCHAIN:
      obj = new BlockchainPageConfig(data);
      break;
    default:
      break;
    }
    return obj;
  }

  #initLayoutConfig(data) {
    if (!data) {
      return null;
    }

    let obj = null;
    switch (data.type_id) {
    case FrontPageLayoutConfig.T_LAYOUT.TRIPLE:
      obj = new TriplePanelConfig(data);
      break;
    default:
      break;
    }
    return obj;
  }
};
