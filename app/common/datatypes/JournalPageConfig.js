(function(dat) {
class JournalPageConfig extends dat.FrontPageTemplateConfig {
  getJournalId() { return this._getData("journal_id"); }
};

dat.JournalPageConfig = JournalPageConfig;
}(window.dat = window.dat || {}));
