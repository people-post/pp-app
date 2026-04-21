import { FrontPageTemplateConfig } from './FrontPageTemplateConfig.js';

export class JournalPageConfig extends FrontPageTemplateConfig {
  getJournalId(): string | null {
    return this._getData('journal_id');
  }
}

