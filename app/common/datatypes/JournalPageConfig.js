import { FrontPageTemplateConfig } from './FrontPageTemplateConfig.js';

export class JournalPageConfig extends FrontPageTemplateConfig {
  getJournalId() { return this._getData("journal_id"); }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.JournalPageConfig = JournalPageConfig;
}
