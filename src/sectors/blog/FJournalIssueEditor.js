export const CF_JOURNAL_ISSUE_EDITOR = {
  ON_CHOOSE : Symbol(),
};

const _CPT_JOURNAL_ISSUE_EDITOR = {
  MAIN : `<br>
  <div id="__ID_ISSUE_ID__"></div>
  <br>
  <div id="__ID_ABSTRACT__"></div>
  <br>
  <div id="__ID_SECTION_LIST__"></div>
  <br>
  <div id="__ID_SUMMARY__"></div>
  <br>
  <div id="__ID_TAGS__"></div>
  <br>
  <br>
  <br>
  <div id="__ID_BTN_LIST__"></div>
  <br>
  <br>`,
  SECTOR_TAGGED : `<div class="pad5px flex flex-start">
    <div id="__ID_TAG__" class="flex-noshrink u-font4"></div>
    <div>:</div>
    <div id="__ID_CONTENT__"></div>
  </div>`,

};

import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { TextArea } from '../../lib/ui/controllers/fragments/TextArea.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { SearchConfig } from '../../common/datatypes/SearchConfig.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { Journal } from '../../common/datatypes/Journal.js';
import { Tag } from '../../common/datatypes/Tag.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { JournalIssue } from '../../common/datatypes/JournalIssue.js';
import { FTag } from '../../common/gui/FTag.js';
import { TagsEditorFragment } from '../../common/gui/TagsEditorFragment.js';
import { FGeneralSearch } from '../../common/search/FGeneralSearch.js';
import { FSearchResultInfo } from '../../common/search/FSearchResultInfo.js';
import { FPostInfo } from './FPostInfo.js';
import { api } from '../../common/plt/Api.js';
import { T_DATA } from '../../common/plt/Events.js';

export class PEditor extends Panel {
  #pIssueId;
  #pAbstract;
  #pSummary;
  #pTags;
  #pBtnList;
  #pSectionList;

  constructor() {
    super();
    this.#pIssueId = new PanelWrapper();
    this.#pAbstract = new PanelWrapper();
    this.#pSummary = new PanelWrapper();
    this.#pSectionList = new ListPanel();
    this.#pTags = new SectionPanel("Menu tags");
    this.#pBtnList = new ListPanel();
  }

  getIssueIdPanel() { return this.#pIssueId; }
  getAbstractPanel() { return this.#pAbstract; }
  getSummaryPanel() { return this.#pSummary; }
  getSectionListPanel() { return this.#pSectionList; }
  getTagsPanel() { return this.#pTags; }
  getBtnListPanel() { return this.#pBtnList; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pIssueId.attach(this._getSubElementId("I"));
    this.#pAbstract.attach(this._getSubElementId("A"));
    this.#pSummary.attach(this._getSubElementId("Y"));
    this.#pSectionList.attach(this._getSubElementId("S"));
    this.#pTags.attach(this._getSubElementId("T"));
    this.#pBtnList.attach(this._getSubElementId("B"));
  }

  _renderFramework() {
    let s = _CPT_JOURNAL_ISSUE_EDITOR.MAIN;
    s = s.replace("__ID_ISSUE_ID__", this._getSubElementId("I"));
    s = s.replace("__ID_ABSTRACT__", this._getSubElementId("A"));
    s = s.replace("__ID_SUMMARY__", this._getSubElementId("Y"));
    s = s.replace("__ID_SECTION_LIST__", this._getSubElementId("S"));
    s = s.replace("__ID_TAGS__", this._getSubElementId("T"));
    s = s.replace("__ID_BTN_LIST__", this._getSubElementId("B"));
    return s;
  }
};

class PSectionTagged extends Panel {
  #pTag;
  #pContent;

  constructor() {
    super();
    this.#pTag = new PanelWrapper();
    this.#pContent = new ListPanel();
  }

  getTagPanel() { return this.#pTag; }
  getContentPanel() { return this.#pContent; }

  _renderFramework() {
    let s = _CPT_JOURNAL_ISSUE_EDITOR.SECTOR_TAGGED;
    s = s.replace("__ID_TAG__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTag.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
  }
};

class FPostSelector extends Fragment {
  #fSearch;

  constructor() {
    super();
    this.#fSearch = new FGeneralSearch();
    this.#fSearch.setDelegate(this);
    this.#fSearch.setResultLayoutType(
        FSearchResultInfo.T_LAYOUT.TITLE_ONLY);
    let c = new SearchConfig();
    c.setCategories([ SocialItem.TYPE.ARTICLE ]);
    this.#fSearch.setKey(".*");
    this.#fSearch.setConfig(c);
    this.setChild("search", this.#fSearch);
  }

  setOwnerId(id) {
    let c = this.#fSearch.getConfig();
    c.setUserIds([ id ]);
    this.#fSearch.setConfig(c);
  }

  setTagId(id) {
    let c = this.#fSearch.getConfig();
    c.setTagIds([ id ]);
    this.#fSearch.setConfig(c);
  }

  onSearchResultClickedInSearchFragment(fSearch, itemType, itemId) {
    this._delegate.onArticleSelectedInPostSelectorFragment(this, itemId);
  }

  _renderOnRender(render) {
    this.#fSearch.attachRender(render);
    this.#fSearch.render();
  }
};

class FPostSelectorHandle extends Fragment {
  #lc;
  #fPost;
  #fSelector;

  constructor() {
    super();
    this.#lc = new LContext();
    this.#lc.setDelegate(this);
    this.#lc.setTargetName("section");

    this.#fPost = new FPostInfo();
    this.#fPost.setSizeType(SocialItem.T_LAYOUT.EXT_EMBED);
    this.#fPost.setDataSource(this);
    this.#fPost.setDelegate(this);
    this.setChild("post", this.#fPost);

    this.#fSelector = new FPostSelector();
    this.#fSelector.setDelegate(this);
  }

  getArticleId() {
    let sid = this.#fPost.getPostId();
    return sid ? sid.getValue() : null;
  }

  setOwnerId(id) { this.#fSelector.setOwnerId(id); }
  setTagId(id) { this.#fSelector.setTagId(id); }
  setPostId(id) { this.#fPost.setPostId(id); }

  onClickInPostInfoFragment(fInfo, postId) { this.#onChoose(); }
  onArticleSelectedInPostSelectorFragment(fSelector, articleId) {
    this.#lc.dismiss();
    this.#fPost.setPostId(
        new SocialItemId(articleId, SocialItem.TYPE.ARTICLE));
    this.render();
    this._delegate.onArticleSelectedInPostSelectorHandleFragment(this);
  }

  action(type, ...args) {
    switch (type) {
    case blog.CF_JOURNAL_ISSUE_EDITOR.ON_CHOOSE:
      this.#onChoose();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let sid = this.#fPost.getPostId();
    if (sid && sid.getValue()) {
      this.#fPost.attachRender(render);
      this.#fPost.render();
    } else {
      let p = new Panel();
      render.wrapPanel(p);
      p.setAttribute("onclick",
                     `G.action(blog.CF_JOURNAL_ISSUE_EDITOR.ON_CHOOSE)`);
      p.setClassName("small-info-text");
      p.replaceContent("Click to choose article...");
    }
  }

  #onChoose() {
    this.#lc.clearOptions();
    this.#lc.addOptionFragment(this.#fSelector);
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }
};

class FSectionTagged extends Fragment {
  #fTag;
  #fSelectors;
  #data;
  #ownerId = null;
  #newIds = [];

  constructor() {
    super();
    this.#fTag = new FTag();
    this.setChild("tag", this.#fTag);

    this.#fSelectors = new FFragmentList();
    this.setChild("selectors", this.#fSelectors);
  }

  getId() { return this.#fTag.getTagId(); }
  getArticleIds() { return this.#newIds; }

  setOwnerId(id) { this.#ownerId = id; }
  setTagId(id) { this.#fTag.setTagId(id); }

  setData(data) {
    this.#data = data;
    this.#newIds =
        data ? data.getPostSocialIds().map(sid => sid.getValue()) : [];
  }

  onArticleSelectedInPostSelectorHandleFragment(fHandle) {
    this.#newIds = [];
    for (let f of this.#fSelectors.getChildren()) {
      let id = f.getArticleId();
      if (id) {
        this.#newIds.push(id);
      }
    }
    this.render();
  }

  _renderOnRender(render) {
    let panel = new PSectionTagged();
    render.wrapPanel(panel);

    let p = panel.getTagPanel();
    this.#fTag.attachRender(p);
    this.#fTag.render();

    p = panel.getContentPanel();

    this.#fSelectors.clear();
    this.#fSelectors.attachRender(p);

    let f, pp;
    for (let id of this.#newIds) {
      pp = new PanelWrapper();
      p.pushPanel(pp);
      f = new FPostSelectorHandle();
      f.setPostId(new SocialItemId(id, SocialItem.TYPE.ARTICLE));
      f.setOwnerId(this.#ownerId);
      f.setTagId(this.#fTag.getTagId());
      f.setDelegate(this);
      f.attachRender(pp);
      f.render();
    }
    this.#fSelectors.append(f);

    pp = new PanelWrapper();
    p.pushPanel(pp);
    f = new FPostSelectorHandle();
    f.setOwnerId(this.#ownerId);
    f.setTagId(this.#fTag.getTagId());
    f.setDelegate(this);
    f.attachRender(pp);
    f.render();
    this.#fSelectors.append(f);
  }
};

export class FJournalIssueEditor extends Fragment {
  #fIssueId;
  #fAbstract;
  #fSummary;
  #fSections;
  #fTags;
  #btnSubmit;
  #journalIssue = null;
  #tags = null;

  constructor() {
    super();
    this.#fIssueId = new TextInput();
    this.#fIssueId.setConfig({hint : "Issue id", isRequired : true});
    this.setChild("issueid", this.#fIssueId);

    this.#fAbstract = new TextArea();
    this.#fAbstract.setClassName("w100 h40px");
    this.#fAbstract.setConfig(
        {title : "Abstract", hint : "", isRequred : false});
    this.#fAbstract.setDelegate(this);
    this.setChild("abstract", this.#fAbstract);

    this.#fSummary = new TextArea();
    this.#fSummary.setClassName("w100 h40px");
    this.#fSummary.setConfig({title : "Summary", hint : "", isRequred : false});
    this.#fSummary.setDelegate(this);
    this.setChild("summary", this.#fSummary);

    this.#fTags = new TagsEditorFragment();
    this.#fTags.setDataSource(this);
    this.#fTags.setDelegate(this);
    this.setChild("tags", this.#fTags);

    this.#fSections = new FFragmentList();
    this.setChild("sections", this.#fSections);

    this.#btnSubmit = new Button();
    this.#btnSubmit.setName("Post");
    this.#btnSubmit.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#btnSubmit.setDelegate(this);
    this.setChild("btnSubmit", this.#btnSubmit);
  }

  onSimpleButtonClicked(fButton) {
    if (fButton == this.#btnSubmit) {
      this.#onSubmit();
    }
  }
  onInputChangeInTextArea(fTextArea, text) {}

  getTagsForTagsEditorFragment(fEditor) {
    if (this.#tags) {
      return this.#tags;
    }

    let ownerId = this.#journalIssue.getOwnerId();
    if (dba.Account.getId() == ownerId && dba.Account.isWebOwner()) {
      this.#tags = dba.WebConfig.getTags();
      return this.#tags;
    } else {
      this.#asyncGetTags(ownerId);
      return [];
    }
  }

  getInitialCheckedIdsForTagsEditorFragment(fEditor) {
    return this.#journalIssue.getTagIds();
  }

  setJournalIssue(journalIssue) { this.#journalIssue = journalIssue; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let panel = new PEditor();
    render.wrapPanel(panel);

    let p = panel.getIssueIdPanel();
    this.#fIssueId.setValue(this.#journalIssue.getIssueId());
    this.#fIssueId.attachRender(p);
    this.#fIssueId.render();

    p = panel.getAbstractPanel();
    this.#fAbstract.setValue(this.#journalIssue.getAbstract());
    this.#fAbstract.attachRender(p);
    this.#fAbstract.render();

    p = panel.getSummaryPanel();
    this.#fSummary.setValue(this.#journalIssue.getSummary());
    this.#fSummary.attachRender(p);
    this.#fSummary.render();

    this.#renderContent(panel.getSectionListPanel(), this.#journalIssue);

    p = panel.getTagsPanel();
    if (dba.Account.isWebOwner()) {
      this.#fTags.setEnableNewTags(true);
    }
    this.#fTags.attachRender(p.getContentPanel());
    this.#fTags.render();

    p = panel.getBtnListPanel();
    let pp = new Panel();
    p.pushPanel(pp);
    this.#btnSubmit.attachRender(pp);
    this.#btnSubmit.render();
  }

  #renderContent(pList, issue) {
    if (!pList) {
      return;
    }

    let journal = dba.Blog.getJournal(issue.getJournalId());
    if (!journal) {
      return;
    }

    switch (journal.getTemplateId()) {
    case Journal.T_TEMPLATE_ID.TAGGED:
      this.#renderTaggedSections(pList, journal.getTemplateConfig(),
                                 issue.getSections(), issue.getOwnerId());
      break;
    default:
      break;
    }
  }

  #renderTaggedSections(pList, config, sections, ownerId) {
    let m = new Map();
    for (let s of sections) {
      m.set(s.getId(), s);
    }

    this.#fSections.clear();
    this.#fSections.attachRender(pList);
    for (let tId of config.getTagIds()) {
      let p = new PanelWrapper();
      pList.pushPanel(p);
      let f = new FSectionTagged();
      f.setOwnerId(ownerId);
      f.setTagId(tId);
      f.setData(m.get(tId));
      f.attachRender(p);
      f.render();
      this.#fSections.append(f);
    }
  }

  #onSubmit() {
    this.#lockActionBtns();
    let data = this.#collectData();
    if (!this.#asyncSubmit(data)) {
      this.#unlockActionBtns();
    }
  }

  #collectData() {
    let data = {};
    data.id = this.#journalIssue.getId();
    data.abstract = this.#fAbstract.getValue();
    data.summary = this.#fSummary.getValue();
    data.tagIds = this.#fTags.getSelectedTagIds();
    data.issueId = this.#fIssueId.getValue();
    data.sections = [];
    for (let f of this.#fSections.getChildren()) {
      let d = {};
      d.id = f.getId();
      d.articleIds = f.getArticleIds();
      data.sections.push(d);
    }
    data.pendingNewTagNames = this.#fTags.getNewTagNames();
    return data;
  }

  #asyncSubmit(data) {
    let fd = new FormData();
    fd.append("id", data.id);
    fd.append("abstract", data.abstract);
    fd.append("summary", data.summary);
    for (let s of data.sections) {
      fd.append("sections",
                JSON.stringify({"id" : s.id, "article_ids" : s.articleIds}));
    }
    for (let id of data.tagIds) {
      fd.append("tag_ids", id);
    }
    for (let name of data.pendingNewTagNames) {
      fd.append("new_tag_names", name);
    }
    fd.append("issue_id", data.issueId);

    let url;
    if (this.#journalIssue.isDraft()) {
      url = "api/blog/post_issue";
    } else {
      url = "api/blog/update_journal_issue";
    }
    api.asyncRawPost(url, fd, r => this.#onSubmitRRR(r),
                     r => this.#onAsyncPostError(r));
    return true;
  }

  #lockActionBtns() { this.#btnSubmit.disable(); }

  #unlockActionBtns() { this.#btnSubmit.enable(); }

  #asyncGetTags(ownerId) {
    let url = "api/blog/available_tags?from=" + ownerId;
    api.asyncFragmentCall(this, url).then(d => this.#onTagsRRR(d));
  }

  #onTagsRRR(data) {
    this.#tags = [];
    for (let d of data.tags) {
      this.#tags.push(new Tag(d));
    }
    this.#fTags.render();
  }

  #onSubmitRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInFragment(this, response.error);
      this.#unlockActionBtns();
    } else {
      dba.WebConfig.setGroups(response.data.groups);
      this._delegate.onJournalIssueUpdatedInJournalIssueEditorFragment(
          this, new JournalIssue(response.data.journal_issue));
    }
  }

  #onAsyncPostError(dummy) {
    this.onLocalErrorInFragment(this, R.get("EL_API_POST"));
    this.#unlockActionBtns();
  }
};

blog.FJournalIssueEditor = FJournalIssueEditor;


// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.CF_JOURNAL_ISSUE_EDITOR = CF_JOURNAL_ISSUE_EDITOR;
}