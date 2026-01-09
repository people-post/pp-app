import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Blog } from '../../common/dba/Blog.js';
import { T_DATA } from '../../common/plt/Events.js';

export const CF_JOURNAL = {
  ON_CLICK : Symbol(),
};

const _CPT_JOURNAL = {} as const;

export class PJournalBase extends Panel {
  getTitlePanel(): Panel | null { return null; }
}

interface JournalDelegate {
  onClickInJournalFragment(f: FJournal): void;
}

export class FJournal extends Fragment {
  static T_LAYOUT = {
    BUTTON_BAR : Symbol(),
  } as const;

  #journalId: string | null = null;
  #tLayout: symbol | null = null;
  #fBar: Button;
  protected _delegate!: JournalDelegate;

  constructor() {
    super();
    this.#fBar = new Button();
    this.#fBar.setDelegate(this);
    this.setChild("bar", this.#fBar);
  }

  getJournalId(): string | null { return this.#journalId; }

  setJournalId(id: string | null): void { this.#journalId = id; }
  setLayoutType(t: symbol | null): void { this.#tLayout = t; }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onClick(); }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.JOURNAL:
      const journalWithId = data as { getId?: () => string };
      if (journalWithId.getId && journalWithId.getId() == this.#journalId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  action(type: symbol | string, ...args: unknown[]): void {
    switch (type) {
    case CF_JOURNAL.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: Panel): void {
    let j = Blog.getJournal(this.#journalId);
    if (!j) {
      return;
    }

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    if (this.#tLayout == this.constructor.T_LAYOUT.BUTTON_BAR) {
      this.#fBar.setName(j.getName());
      this.#fBar.attachRender(panel);
      this.#fBar.render();
      return;
    }

    let p = panel.getTitlePanel();
    if (p) {
      p.replaceContent(j.getName());
    }
  }

  #createPanel(): PJournalBase {
    let p: PJournalBase;
    switch (this.#tLayout) {
    default:
      p = new PJournalBase();
      break;
    }
    return p;
  }

  #onClick(): void { this._delegate.onClickInJournalFragment(this); }
}
