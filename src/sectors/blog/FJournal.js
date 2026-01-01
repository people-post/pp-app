import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Blog } from '../../common/dba/Blog.js';
import { T_DATA } from '../../common/plt/Events.js';

export const CF_JOURNAL = {
  ON_CLICK : Symbol(),
};

const _CPT_JOURNAL = {};

export class PJournalBase extends Panel {
  getTitlePanel() { return null; }
};

export class FJournal extends Fragment {
  static T_LAYOUT = {
    BUTTON_BAR : Symbol(),
  };

  #journalId = null;
  #tLayout = null;
  #fBar = null;

  constructor() {
    super();
    this.#fBar = new Button();
    this.#fBar.setDelegate(this);
    this.setChild("bar", this.#fBar);
  }

  getJournalId() { return this.#journalId; }

  setJournalId(id) { this.#journalId = id; }
  setLayoutType(t) { this.#tLayout = t; }

  onSimpleButtonClicked(fBtn) { this.#onClick(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.JOURNAL:
      if (data.getId() == this.#journalId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  action(type, ...args) {
    switch (type) {
    case CF_JOURNAL.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
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

  #createPanel() {
    let p;
    switch (this.#tLayout) {
    default:
      p = new PJournalBase();
      break;
    }
    return p;
  }

  #onClick() { this._delegate.onClickInJournalFragment(this); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.CF_JOURNAL = CF_JOURNAL;
}