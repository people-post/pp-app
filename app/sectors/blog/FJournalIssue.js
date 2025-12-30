import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FJournalIssue extends blog.FPostBase {
  #issueId = null;
  #fSections;

  constructor() {
    super();
    this.#fSections = new FFragmentList();
    this.setChild("sections", this.#fSections);
  }

  setIssueId(id) { this.#issueId = id; }

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

  _renderOnRender(postPanel) {
    let issue = dba.Blog.getJournalIssue(this.#issueId);
    if (!issue) {
      return;
    }

    let journal = dba.Blog.getJournal(issue.getJournalId());
    this.#renderTitle(postPanel.getTitlePanel(), journal, issue);
    this.#renderAbstract(postPanel.getAbstractPanel(), issue);
    this.#renderSections(postPanel.getContentPanel(), journal,
                         issue.getSections());
    this.#renderSummary(postPanel.getSummaryPanel(), issue);
  }

  #renderTitle(panel, journal, issue) {
    if (!panel) {
      return;
    }
    if (!journal) {
      return;
    }
    let s = journal.getName() + " ";
    let id = issue.getIssueId();
    if (id) {
      s += id;
    }
    panel.replaceContent(s);
  }

  #renderAbstract(panel, issue) {
    if (!panel) {
      return;
    }
    panel.replaceContent(issue.getAbstract());
  }

  #renderSummary(panel, issue) {
    if (!panel) {
      return;
    }
    panel.replaceContent(issue.getSummary());
  }

  #renderSections(panel, journal, sections) {
    if (!panel) {
      return;
    }
    if (!journal) {
      return;
    }
    let pList = new ListPanel();
    panel.wrapPanel(pList);

    this.#fSections.clear();
    this.#fSections.attachRender(pList);

    let tId = journal.getTemplateId();
    let tConfig = journal.getTemplateConfig();
    switch (tId) {
    case dat.Journal.T_TEMPLATE_ID.TAGGED:
      this.#renderTaggedSections(pList, tConfig, sections);
      break;
    default:
      this.#renderDefaultSections(pList, sections);
      break;
    }
  }

  #renderDefaultSections(pList, sections) {
    for (let s of sections) {
      let p = new PanelWrapper();
      pList.pushPanel(p);
      let f = new blog.FJournalIssueSection();
      f.setData(s);
      f.attachRender(p);
      f.render();
      this.#fSections.append(f);
    }
  }

  #renderTaggedSections(pList, config, sections) {
    let m = new Map();
    for (let s of sections) {
      m.set(s.getId(), s);
    }

    for (let tId of config.getTagIds()) {
      let p = new PanelWrapper();
      pList.pushPanel(p);

      let f = new blog.FJournalIssueSectionTagged();
      f.setTagId(tId);
      f.setPlaceholder(config.getPlaceholder());
      f.setData(m.get(tId));
      f.attachRender(p);
      this.#fSections.append(f);
      f.render();
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FJournalIssue = FJournalIssue;
}
