import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { FTabbedPane } from '../../lib/ui/controllers/fragments/FTabbedPane.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
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
  #lc;
  #fBtn;
  #isPendingChoices = false;

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

  isAvailable() {
    if (window.dba.Account.isAuthenticated()) {
      if (window.dba.Account.isWebOwner() ||
          Blog.getRoleIdsByType(BlogRole.T_ROLE.EXCLUSIVE)
              .some(id => window.dba.Account.isInGroup(id))) {
        return true;
      }
    }
    return false;
  }

  onSearchResultClickedInSearchFragment(fSearch, itemType, itemId) {
    this.#lc.dismiss();
    this.#asyncCreateArticle(itemId);
  }

  onGuiActionButtonClick(fButton) { this.#onClick(); }

  onClickInJournalFragment(fJournal) {
    this.#lc.dismiss();
    this.#asyncCreateJournalIssue(fJournal.getJournalId());
  }

  onOptionClickedInContextLayer(lContext, value) {
    this.#lc.dismiss();
    this.#asyncCreateArticle(value);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.GROUPS:
      this.#onGroupDataReceived();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    this.#fBtn.attachRender(render);
    this.#fBtn.render();
  }

  #onClick() {
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

  #onGroupDataReceived() {
    if (this.#isPendingChoices) {
      this.#isPendingChoices = false;
      let gIds = window.dba.Account.getGroupIds();
      this.#showCreateOptions(gIds);
    }
  }

  #showCreateOptions(groupIds) {
    let ids = [ WebConfig.getOwnerId() ];
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

  #createUserChoiceList(userIds) {
    let f = new FLocalUserSearch();
    f.setUserIds(userIds);
    f.setDelegate(this);
    return f;
  }

  #createJournalChoiceList(journalIds) {
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

  #asyncCreateArticle(forOwnerId) {
    let url = "api/blog/new_draft?for=" + forOwnerId;
    Api.asFragmentCall(this, url).then(d => this.#onDraftArticleRRR(d));
  }

  #onDraftArticleRRR(data) {
    this.#showDraftEditor(new DraftArticle(data.draft));
  }

  #showDraftEditor(draftArticle) {
    let v = new View();
    let f = new FvcPostEditor();
    f.setPost(draftArticle);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Draft post");
  }

  #asyncCreateJournalIssue(journalId) {
    let url = "api/blog/new_issue?for=" + journalId;
    Api.asFragmentCall(this, url).then(d => this.#onDraftIssueRRR(d));
  }

  #onDraftIssueRRR(data) {
    this.#showDraftIssueEditor(new DraftJournalIssue(data.draft));
  }

  #showDraftIssueEditor(draftIssue) {
    let v = new View();
    let f = new FvcPostEditor();
    f.setPost(draftIssue);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Draft issue");
  }
};
