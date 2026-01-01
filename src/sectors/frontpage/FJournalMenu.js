import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { MenuContent } from '../../common/menu/MenuContent.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Blog } from '../../common/dba/Blog.js';

export class FJournalMenu extends MenuContent {
  #journalIds;
  #currentJournalId = null;
  #currentIssueId = null;

  getQuickLinkMinWidth() { return 100; }

  setJournalIds(ids) { this.#journalIds = ids; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.JOURNAL:
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

    let j = Blog.getJournal(this.#currentJournalId);
    if (j) {
      p.replaceContent(j.getName());
    }
  }
};
