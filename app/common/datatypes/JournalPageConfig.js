export class JournalPageConfig extends dat.FrontPageTemplateConfig {
  getJournalId() { return this._getData("journal_id"); }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.JournalPageConfig = JournalPageConfig;
}
