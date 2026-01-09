import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { FTabbedPane } from '../../lib/ui/controllers/fragments/FTabbedPane.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ICON } from '../../common/constants/Icons.js';
import { BlogRole } from '../../common/datatypes/BlogRole.js';
import { DraftArticle } from '../../common/datatypes/DraftArticle.js';
import { DraftJournalIssue } from '../../common/datatypes/DraftJournalIssue.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { FLocalUserSearch } from '../../common/search/FLocalUserSearch.js';
import { FJournal } from './FJournal.js';
import { FvcPostEditor } from './FvcPostEditor.js';
import { Groups } from '../../common/dba/Groups.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Blog } from '../../common/dba/Blog.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { Api } from '../../common/plt/Api.js';

// ActionButton needs some redesign
export class AbNew extends Fragment {
  #lc: LContext;
  #fBtn: ActionButton;
  #isPendingChoices: boolean = false;

  constructor() {
    super();
    this.#lc = new LContext();
    this.#lc.setDelegate(this);
    this.#lc.setTargetName("adding post");

    this.#fBtn = new ActionButton();
    this.#fBtn.setIcon(ActionButton.T_ICON.NEW);
    this.#fBtn.setDelegate(this);
    this.setChild('btn', this.#fBtn);
  }

  isAvailable(): boolean {
    if (window.dba.Account.isAuthenticated()) {
      if (window.dba.Account.isWebOwner() ||
          Blog.getRoleIdsByType(BlogRole.T_ROLE.EXCLUSIVE)
              .some(id => window.dba.Account.isInGroup(id))) {
        return true;
      }
    }
    return false;
  }

  onSearchResultClickedInSearchFragment(_fSearch: unknown, _itemType: string, itemId: string): void {
    this.#lc.dismiss();
    this.#asyncCreateArticle(itemId);
  }

  onGuiActionButtonClick(_fButton: ActionButton): void { this.#onClick(); }

  onClickInJournalFragment(fJournal: FJournal): void {
    this.#lc.dismiss();
    this.#asyncCreateJournalIssue(fJournal.getJournalId());
  }

  onOptionClickedInContextLayer(_lContext: LContext, value: string): void {
    this.#lc.dismiss();
    this.#asyncCreateArticle(value);
  }

  handleSessionDataUpdate(dataType: symbol, _data: unknown): void {
    switch (dataType) {
    case T_DATA.GROUPS:
      this.#onGroupDataReceived();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, _data);
  }

  _renderOnRender(render: Panel): void {
    this.#fBtn.attachRender(render);
    this.#fBtn.render();
  }

  #onClick(): void {
    if (window.dba.Account.isWebOwner()) {
      let gIds = window.dba.Account.getGroupIds();
      if (!Groups.loadMissing(gIds)) {
        this.#showCreateOptions(gIds);
      } else {
        this.#isPendingChoices = true;
      }
    } else {
      // Visitor can only create article for owner
      this.#asyncCreateArticle(WebConfig.getOwnerId());
    }
  }

  #onGroupDataReceived(): void {
    if (this.#isPendingChoices) {
      this.#isPendingChoices = false;
      let gIds = window.dba.Account.getGroupIds();
      this.#showCreateOptions(gIds);
    }
  }

  #showCreateOptions(groupIds: string[]): void {
    let ids: string[] = [ WebConfig.getOwnerId() ];
    for (let id of groupIds) {
      let g = Groups.get(id);
      if (g && g.isWriterGroup()) {
        ids.push(g.getOwnerId());
      }
    }

    let ownerIds = Array.from(new Set(ids));
    let journalIds = window.dba.Account.getJournalIds();
    if (journalIds.length > 0) {
      // With journal
      if (ownerIds.length > 1) {
        // Multi owners
        this.#lc.clearOptions();
        let fTPane = new FTabbedPane();

        fTPane.addPane({name : "Article", value : "ARTICLE"},
                       this.#createUserChoiceList(ownerIds));
        fTPane.addPane({name : "Journal", value : "JOURNAL"},
                       this.#createJournalChoiceList(journalIds));

        this.#lc.addOptionFragment(fTPane);
        Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                    "Context");
      } else {
        // Single owner
        this.#lc.clearOptions();
        this.#lc.addOption("Article", ownerIds[0], ICON.ARTICLE);
        this.#lc.addOptionFragment(this.#createJournalChoiceList(journalIds));
        Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                    "Context");
      }
    } else {
      // No journal
      if (ownerIds.length > 1) {
        // Multi owners
        this.#lc.clearOptions();
        this.#lc.addOptionFragment(this.#createUserChoiceList(ownerIds));
        Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                    "Context");
      } else {
        // Single owner
        this.#asyncCreateArticle(ownerIds[0]);
      }
    }
  }

  #createUserChoiceList(userIds: string[]): FLocalUserSearch {
    let f = new FLocalUserSearch();
    f.setUserIds(userIds);
    f.setDelegate(this);
    return f;
  }

  #createJournalChoiceList(journalIds: string[]): FSimpleFragmentList {
    let f = new FSimpleFragmentList();
    for (let jId of journalIds) {
      let ff = new FJournal();
      ff.setJournalId(jId);
      ff.setLayoutType(FJournal.T_LAYOUT.BUTTON_BAR);
      ff.setDelegate(this);
      f.append(ff);
    }
    return f;
  }

  #asyncCreateArticle(forOwnerId: string): void {
    let url = "api/blog/new_draft?for=" + forOwnerId;
    Api.asFragmentCall(this, url).then((d: {draft: unknown}) => this.#onDraftArticleRRR(d));
  }

  #onDraftArticleRRR(data: {draft: unknown}): void {
    this.#showDraftEditor(new DraftArticle(data.draft as Record<string, unknown>));
  }

  #showDraftEditor(draftArticle: DraftArticle): void {
    let v = new View();
    let f = new FvcPostEditor();
    f.setPost(draftArticle);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Draft post");
  }

  #asyncCreateJournalIssue(journalId: string): void {
    let url = "api/blog/new_issue?for=" + journalId;
    Api.asFragmentCall(this, url).then((d: {draft: unknown}) => this.#onDraftIssueRRR(d));
  }

  #onDraftIssueRRR(data: {draft: unknown}): void {
    this.#showDraftIssueEditor(new DraftJournalIssue(data.draft as Record<string, unknown>));
  }

  #showDraftIssueEditor(draftIssue: DraftJournalIssue): void {
    let v = new View();
    let f = new FvcPostEditor();
    f.setPost(draftIssue);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Draft issue");
  }
};
