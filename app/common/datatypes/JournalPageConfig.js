import { FrontPageTemplateConfig } from './FrontPageTemplateConfig.js';

export class JournalPageConfig extends FrontPageTemplateConfig {
  getJournalId() { return this._getData("journal_id"); }
};


