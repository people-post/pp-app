import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Journal } from '../../common/datatypes/Journal.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FPostBase } from './FPostBase.js';
import { Blog } from '../../common/dba/Blog.js';
import { FJournalIssueSection } from './FJournalIssueSection.js';
import { FJournalIssueSectionTagged } from './FJournalIssueSectionTagged.js';
import type { JournalIssue } from '../../common/datatypes/JournalIssue.js';
import type { JournalIssueSection } from '../../common/datatypes/JournalIssueSection.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FJournalIssue extends FPostBase {
  #issueId: string | null = null;
  #fSections: FFragmentList;

  constructor() {
    super();
    this.#fSections = new FFragmentList();
    this.setChild("sections", this.#fSections);
  }

  setIssueId(id: string | null): void { this.#issueId = id; }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.JOURNAL:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(postPanel: Panel): void {
    let issue = Blog.getJournalIssue(this.#issueId);
    if (!issue) {
      return;
    }

    let journal = Blog.getJournal(issue.getJournalId());
    this.#renderTitle(postPanel.getTitlePanel(), journal, issue);
    this.#renderAbstract(postPanel.getAbstractPanel(), issue);
    this.#renderSections(postPanel.getContentPanel(), journal,
                         issue.getSections());
    this.#renderSummary(postPanel.getSummaryPanel(), issue);
  }

  #renderTitle(panel: Panel | null, journal: Journal | null, issue: JournalIssue): void {
    if (!panel || !journal) {
      return;
    }
    let s = journal.getName() + " ";
    let id = issue.getIssueId();
    if (id) {
      s += id;
    }
    panel.replaceContent(s);
  }

  #renderAbstract(panel: Panel | null, issue: JournalIssue): void {
    if (!panel) {
      return;
    }
    panel.replaceContent(issue.getAbstract() || "");
  }

  #renderSummary(panel: Panel | null, issue: JournalIssue): void {
    if (!panel) {
      return;
    }
    panel.replaceContent(issue.getSummary() || "");
  }

  #renderSections(panel: Panel | null, journal: Journal | null, sections: JournalIssueSection[]): void {
    if (!panel || !journal) {
      return;
    }
    let pList = new ListPanel();
    panel.wrapPanel(pList);

    this.#fSections.clear();
    this.#fSections.attachRender(pList);

    let tId = journal.getTemplateId();
    let tConfig = journal.getTemplateConfig();
    switch (tId) {
    case Journal.T_TEMPLATE_ID.TAGGED:
      this.#renderTaggedSections(pList, tConfig, sections);
      break;
    default:
      this.#renderDefaultSections(pList, sections);
      break;
    }
  }

  #renderDefaultSections(pList: ListPanel, sections: JournalIssueSection[]): void {
    for (let s of sections) {
      let p = new PanelWrapper();
      pList.pushPanel(p);
      let f = new FJournalIssueSection();
      f.setData(s);
      f.attachRender(p);
      f.render();
      this.#fSections.append(f);
    }
  }

  #renderTaggedSections(pList: ListPanel, config: { getTagIds: () => string[]; getPlaceholder: () => string | null }, sections: JournalIssueSection[]): void {
    let m = new Map<string, JournalIssueSection>();
    for (let s of sections) {
      m.set(s.getId(), s);
    }

    for (let tId of config.getTagIds()) {
      let p = new PanelWrapper();
      pList.pushPanel(p);

      let f = new FJournalIssueSectionTagged();
      f.setTagId(tId);
      f.setPlaceholder(config.getPlaceholder());
      f.setData(m.get(tId) || null);
      f.attachRender(p);
      this.#fSections.append(f);
      f.render();
    }
  }
}
