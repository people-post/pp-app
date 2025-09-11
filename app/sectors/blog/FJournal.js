(function(blog) {
blog.CF_JOURNAL = {
  ON_CLICK : Symbol(),
};

const _CPT_JOURNAL = {};

class PJournalBase extends ui.Panel {
  getTitlePanel() { return null; }
};

class FJournal extends ui.Fragment {
  static T_LAYOUT = {
    BUTTON_BAR : Symbol(),
  };

  #journalId = null;
  #tLayout = null;
  #fBar = null;

  constructor() {
    super();
    this.#fBar = new ui.Button();
    this.#fBar.setDelegate(this);
    this.setChild("bar", this.#fBar);
  }

  getJournalId() { return this.#journalId; }

  setJournalId(id) { this.#journalId = id; }
  setLayoutType(t) { this.#tLayout = t; }

  onSimpleButtonClicked(fBtn) { this.#onClick(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.JOURNAL:
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
    case blog.CF_JOURNAL.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let j = dba.Blog.getJournal(this.#journalId);
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

blog.FJournal = FJournal;
}(window.blog = window.blog || {}));
