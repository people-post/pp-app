import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { MenuContent } from '../../common/menu/MenuContent.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Blog } from '../../common/dba/Blog.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FJournalMenu extends MenuContent {
  #journalIds: string[];
  #currentJournalId: string | null = null;
  #currentIssueId: string | null = null;

  constructor() {
    super();
    this.#journalIds = [];
  }

  getQuickLinkMinWidth(): number { return 100; }

  setJournalIds(ids: string[]): void { this.#journalIds = ids; }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.JOURNAL:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    let p = new Panel();
    render.wrapPanel(p);

    if (!this.#currentJournalId) {
      this.#currentJournalId = this.#journalIds[0] || null;
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
