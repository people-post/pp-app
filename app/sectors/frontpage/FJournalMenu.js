(function(ftpg) {
class FJournalMenu extends gui.MenuContent {
  #journalIds;
  #currentJournalId = null;
  #currentIssueId = null;

  getQuickLinkMinWidth() { return 100; }

  setJournalIds(ids) { this.#journalIds = ids; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.JOURNAL:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let p = new ui.Panel();
    render.wrapPanel(p);

    if (!this.#currentJournalId) {
      this.#currentJournalId = this.#journalIds[0];
    }
    if (!this.#currentJournalId) {
      return;
    }

    let j = dba.Blog.getJournal(this.#currentJournalId);
    if (j) {
      p.replaceContent(j.getName());
    }
  }
};

ftpg.FJournalMenu = FJournalMenu;
}(window.ftpg = window.ftpg || {}));
