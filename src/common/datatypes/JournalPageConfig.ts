import { FrontPageTemplateConfig } from './FrontPageTemplateConfig.js';

export class JournalPageConfig extends FrontPageTemplateConfig {
  getJournalId(): unknown {
    return this._getData('journal_id');
  }
}

