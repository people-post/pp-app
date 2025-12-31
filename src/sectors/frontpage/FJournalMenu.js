import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FJournalMenu extends gui.MenuContent {
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
    let p = new Panel();
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.ftpg = window.ftpg || {};
  window.ftpg.FJournalMenu = FJournalMenu;
}
