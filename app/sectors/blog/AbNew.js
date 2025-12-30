import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { FTabbedPane } from '../../lib/ui/controllers/fragments/FTabbedPane.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { C } from '../../lib/framework/Constants.js';
import { BlogRole } from '../../common/datatypes/BlogRole.js';
import { DraftArticle } from '../../common/datatypes/DraftArticle.js';
import { DraftJournalIssue } from '../../common/datatypes/DraftJournalIssue.js';

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

    this.#fBtn = new gui.ActionButton();
    this.#fBtn.setIcon(gui.ActionButton.T_ICON.NEW);
    this.#fBtn.setDelegate(this);
    this.setChild('btn', this.#fBtn);
  }

  isAvailable() {
    if (dba.Account.isAuthenticated()) {
      if (dba.Account.isWebOwner() ||
          dba.Blog.getRoleIdsByType(BlogRole.T_ROLE.EXCLUSIVE)
              .some(id => dba.Account.isInGroup(id))) {
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
    case plt.T_DATA.GROUPS:
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
    if (dba.Account.isWebOwner()) {
      let gIds = dba.Account.getGroupIds();
      if (!dba.Groups.loadMissing(gIds)) {
        this.#showCreateOptions(gIds);
      } else {
        this.#isPendingChoices = true;
      }
    } else {
      // Visitor can only create article for owner
      this.#asyncCreateArticle(dba.WebConfig.getOwnerId());
    }
  }

  #onGroupDataReceived() {
    if (this.#isPendingChoices) {
      this.#isPendingChoices = false;
      let gIds = dba.Account.getGroupIds();
      this.#showCreateOptions(gIds);
    }
  }

  #showCreateOptions(groupIds) {
    let ids = [ dba.WebConfig.getOwnerId() ];
    for (let id of groupIds) {
      let g = dba.Groups.get(id);
      if (g && g.isWriterGroup()) {
        ids.push(g.getOwnerId());
      }
    }

    let ownerIds = Array.from(new Set(ids));
    let journalIds = dba.Account.getJournalIds();
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
        fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this.#lc,
                                    "Context");
      } else {
        // Single owner
        this.#lc.clearOptions();
        this.#lc.addOption("Article", ownerIds[0], C.ICON.ARTICLE);
        this.#lc.addOptionFragment(this.#createJournalChoiceList(journalIds));
        fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this.#lc,
                                    "Context");
      }
    } else {
      // No journal
      if (ownerIds.length > 1) {
        // Multi owners
        this.#lc.clearOptions();
        this.#lc.addOptionFragment(this.#createUserChoiceList(ownerIds));
        fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this.#lc,
                                    "Context");
      } else {
        // Single owner
        this.#asyncCreateArticle(ownerIds[0]);
      }
    }
  }

  #createUserChoiceList(userIds) {
    let f = new srch.FLocalUserSearch();
    f.setUserIds(userIds);
    f.setDelegate(this);
    return f;
  }

  #createJournalChoiceList(journalIds) {
    let f = new FSimpleFragmentList();
    for (let jId of journalIds) {
      let ff = new blog.FJournal();
      ff.setJournalId(jId);
      ff.setLayoutType(blog.FJournal.T_LAYOUT.BUTTON_BAR);
      ff.setDelegate(this);
      f.append(ff);
    }
    return f;
  }

  #asyncCreateArticle(forOwnerId) {
    let url = "api/blog/new_draft?for=" + forOwnerId;
    plt.Api.asyncFragmentCall(this, url).then(d => this.#onDraftArticleRRR(d));
  }

  #onDraftArticleRRR(data) {
    this.#showDraftEditor(new DraftArticle(data.draft));
  }

  #showDraftEditor(draftArticle) {
    let v = new View();
    let f = new blog.FvcPostEditor();
    f.setPost(draftArticle);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Draft post");
  }

  #asyncCreateJournalIssue(journalId) {
    let url = "api/blog/new_issue?for=" + journalId;
    plt.Api.asyncFragmentCall(this, url).then(d => this.#onDraftIssueRRR(d));
  }

  #onDraftIssueRRR(data) {
    this.#showDraftIssueEditor(new DraftJournalIssue(data.draft));
  }

  #showDraftIssueEditor(draftIssue) {
    let v = new View();
    let f = new blog.FvcPostEditor();
    f.setPost(draftIssue);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Draft issue");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.AbNew = AbNew;
}
