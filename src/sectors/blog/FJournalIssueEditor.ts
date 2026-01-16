export const CF_JOURNAL_ISSUE_EDITOR = {
  ON_CHOOSE : Symbol(),
} as const;

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
} as const;

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
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Blog } from '../../common/dba/Blog.js';
import { R } from '../../common/constants/R.js';
import { FPostInfo } from './FPostInfo.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Api } from '../../common/plt/Api.js';
import type { JournalIssueSection } from '../../common/datatypes/JournalIssueSection.js';
import type { JournalIssue as JournalIssueType } from '../../common/datatypes/JournalIssue.js';
import { Account } from '../../common/dba/Account.js';

export class PEditor extends Panel {
  #pIssueId: PanelWrapper;
  #pAbstract: PanelWrapper;
  #pSummary: PanelWrapper;
  #pTags: SectionPanel;
  #pBtnList: ListPanel;
  #pSectionList: ListPanel;

  constructor() {
    super();
    this.#pIssueId = new PanelWrapper();
    this.#pAbstract = new PanelWrapper();
    this.#pSummary = new PanelWrapper();
    this.#pSectionList = new ListPanel();
    this.#pTags = new SectionPanel("Menu tags");
    this.#pBtnList = new ListPanel();
  }

  getIssueIdPanel(): PanelWrapper { return this.#pIssueId; }
  getAbstractPanel(): PanelWrapper { return this.#pAbstract; }
  getSummaryPanel(): PanelWrapper { return this.#pSummary; }
  getSectionListPanel(): ListPanel { return this.#pSectionList; }
  getTagsPanel(): SectionPanel { return this.#pTags; }
  getBtnListPanel(): ListPanel { return this.#pBtnList; }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pIssueId.attach(this._getSubElementId("I"));
    this.#pAbstract.attach(this._getSubElementId("A"));
    this.#pSummary.attach(this._getSubElementId("Y"));
    this.#pSectionList.attach(this._getSubElementId("S"));
    this.#pTags.attach(this._getSubElementId("T"));
    this.#pBtnList.attach(this._getSubElementId("B"));
  }

  _renderFramework(): string {
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
  #pTag: PanelWrapper;
  #pContent: ListPanel;

  constructor() {
    super();
    this.#pTag = new PanelWrapper();
    this.#pContent = new ListPanel();
  }

  getTagPanel(): PanelWrapper { return this.#pTag; }
  getContentPanel(): ListPanel { return this.#pContent; }

  _renderFramework(): string {
    let s = _CPT_JOURNAL_ISSUE_EDITOR.SECTOR_TAGGED;
    s = s.replace("__ID_TAG__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pTag.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
  }
};

class FPostSelector extends Fragment {
  #fSearch: FGeneralSearch;

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

  setOwnerId(id: string): void {
    let c = this.#fSearch.getConfig();
    c.setUserIds([ id ]);
    this.#fSearch.setConfig(c);
  }

  setTagId(id: string): void {
    let c = this.#fSearch.getConfig();
    c.setTagIds([ id ]);
    this.#fSearch.setConfig(c);
  }

  onSearchResultClickedInSearchFragment(_fSearch: FGeneralSearch, _itemType: string, itemId: string): void {
    (this._delegate as any).onArticleSelectedInPostSelectorFragment(this, itemId);
  }

  _renderOnRender(render: Panel): void {
    this.#fSearch.attachRender(render);
    this.#fSearch.render();
  }
};

class FPostSelectorHandle extends Fragment {
  #lc: LContext;
  #fPost: FPostInfo;
  #fSelector: FPostSelector;

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

  getArticleId(): string | null {
    let sid = this.#fPost.getPostId();
    return sid ? sid.getValue() : null;
  }

  setOwnerId(id: string): void { this.#fSelector.setOwnerId(id); }
  setTagId(id: string): void { this.#fSelector.setTagId(id); }
  setPostId(id: SocialItemId): void { this.#fPost.setPostId(id); }

  onClickInPostInfoFragment(_fInfo: FPostInfo, _postId: SocialItemId): void { this.#onChoose(); }
  onArticleSelectedInPostSelectorFragment(_fSelector: FPostSelector, articleId: string): void {
    this.#lc.dismiss();
    this.#fPost.setPostId(
        new SocialItemId(articleId, SocialItem.TYPE.ARTICLE));
    this.render();
    (this._delegate as any).onArticleSelectedInPostSelectorHandleFragment(this);
  }

  action(type: symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_JOURNAL_ISSUE_EDITOR.ON_CHOOSE:
      this.#onChoose();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderOnRender(render: Panel): void {
    let sid = this.#fPost.getPostId();
    if (sid && sid.getValue()) {
      this.#fPost.attachRender(render);
      this.#fPost.render();
    } else {
      let p = new Panel();
      render.wrapPanel(p);
      p.setAttribute("onclick",
                     `G.action(CF_JOURNAL_ISSUE_EDITOR.ON_CHOOSE)`);
      p.setClassName("small-info-text");
      p.replaceContent("Click to choose article...");
    }
  }

  #onChoose(): void {
    this.#lc.clearOptions();
    this.#lc.addOptionFragment(this.#fSelector);
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }
};

class FSectionTagged extends Fragment {
  #fTag: FTag;
  #fSelectors: FFragmentList;
  #data: JournalIssueSection | null = null;
  #ownerId: string | null = null;
  #newIds: string[] = [];

  constructor() {
    super();
    this.#fTag = new FTag();
    this.setChild("tag", this.#fTag);

    this.#fSelectors = new FFragmentList();
    this.setChild("selectors", this.#fSelectors);
  }

  getId(): string | null { return this.#fTag.getTagId(); }
  getArticleIds(): string[] { return this.#newIds; }

  setOwnerId(id: string | null): void { this.#ownerId = id; }
  setTagId(id: string): void { this.#fTag.setTagId(id); }

  setData(data: JournalIssueSection | null): void {
    this.#data = data;
    this.#newIds =
        data ? data.getPostSocialIds().map(sid => sid.getValue()!) : [];
  }

  onArticleSelectedInPostSelectorHandleFragment(_fHandle: FPostSelectorHandle): void {
    this.#newIds = [];
    for (let f of this.#fSelectors.getChildren()) {
      let id = (f as FPostSelectorHandle).getArticleId();
      if (id) {
        this.#newIds.push(id);
      }
    }
    this.render();
  }

  _renderOnRender(render: Panel): void {
    let panel = new PSectionTagged();
    render.wrapPanel(panel);

    let p = panel.getTagPanel();
    this.#fTag.attachRender(p);
    this.#fTag.render();

    p = panel.getContentPanel();

    this.#fSelectors.clear();
    this.#fSelectors.attachRender(p);

    let f: FPostSelectorHandle | null = null;
    let pp: PanelWrapper;
    for (let id of this.#newIds) {
      pp = new PanelWrapper();
      p.pushPanel(pp);
      f = new FPostSelectorHandle();
      f.setPostId(new SocialItemId(id, SocialItem.TYPE.ARTICLE));
      f.setOwnerId(this.#ownerId);
      f.setTagId(this.#fTag.getTagId()!);
      f.setDelegate(this);
      f.attachRender(pp);
      f.render();
    }
    if (f) {
      this.#fSelectors.append(f);
    }

    pp = new PanelWrapper();
    p.pushPanel(pp);
    f = new FPostSelectorHandle();
    f.setOwnerId(this.#ownerId);
    f.setTagId(this.#fTag.getTagId()!);
    f.setDelegate(this);
    f.attachRender(pp);
    f.render();
    this.#fSelectors.append(f);
  }
};

export class FJournalIssueEditor extends Fragment {
  #fIssueId: TextInput;
  #fAbstract: TextArea;
  #fSummary: TextArea;
  #fSections: FFragmentList;
  #fTags: TagsEditorFragment;
  #btnSubmit: Button;
  #journalIssue: JournalIssueType | null = null;
  #tags: Tag[] | null = null;

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

  onSimpleButtonClicked(fButton: Button): void {
    if (fButton == this.#btnSubmit) {
      this.#onSubmit();
    }
  }
  onInputChangeInTextArea(_fTextArea: TextArea, _text: string): void {}

  getTagsForTagsEditorFragment(_fEditor: TagsEditorFragment): Tag[] {
    if (this.#tags) {
      return this.#tags;
    }

    if (!this.#journalIssue) {
      return [];
    }
    let ownerId = this.#journalIssue.getOwnerId();
    if (Account.getId() == ownerId && Account.isWebOwner()) {
      this.#tags = WebConfig.getTags();
      return this.#tags;
    } else {
      this.#asyncGetTags(ownerId);
      return [];
    }
  }

  getInitialCheckedIdsForTagsEditorFragment(_fEditor: TagsEditorFragment): string[] {
    return this.#journalIssue ? this.#journalIssue.getTagIds() : [];
  }

  setJournalIssue(journalIssue: JournalIssueType): void { this.#journalIssue = journalIssue; }

  handleSessionDataUpdate(dataType: symbol, _data: unknown): void {
    switch (dataType) {
    case T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, _data);
  }

  _renderOnRender(render: Panel): void {
    if (!this.#journalIssue) {
      return;
    }
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
    if (Account.isWebOwner()) {
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

  #renderContent(pList: ListPanel, issue: JournalIssueType): void {
    if (!pList) {
      return;
    }

    let journal = Blog.getJournal(issue.getJournalId());
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

  #renderTaggedSections(pList: ListPanel, config: any, sections: JournalIssueSection[], ownerId: string): void {
    let m = new Map<string, JournalIssueSection>();
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
      f.setData(m.get(tId) || null);
      f.attachRender(p);
      f.render();
      this.#fSections.append(f);
    }
  }

  #onSubmit(): void {
    this.#lockActionBtns();
    let data = this.#collectData();
    if (!this.#asyncSubmit(data)) {
      this.#unlockActionBtns();
    }
  }

  #collectData(): {
    id: string;
    abstract: string;
    summary: string;
    tagIds: string[];
    issueId: string;
    sections: Array<{id: string; articleIds: string[]}>;
    pendingNewTagNames: string[];
  } {
    if (!this.#journalIssue) {
      throw new Error("Journal issue not set");
    }
    let data: {
      id: string;
      abstract: string;
      summary: string;
      tagIds: string[];
      issueId: string;
      sections: Array<{id: string; articleIds: string[]}>;
      pendingNewTagNames: string[];
    } = {
      id: this.#journalIssue.getId(),
      abstract: this.#fAbstract.getValue(),
      summary: this.#fSummary.getValue(),
      tagIds: this.#fTags.getSelectedTagIds(),
      issueId: this.#fIssueId.getValue(),
      sections: [],
      pendingNewTagNames: this.#fTags.getNewTagNames()
    };
    for (let f of this.#fSections.getChildren()) {
      let d: {id: string; articleIds: string[]} = {
        id: (f as FSectionTagged).getId()!,
        articleIds: (f as FSectionTagged).getArticleIds()
      };
      data.sections.push(d);
    }
    return data;
  }

  #asyncSubmit(data: {
    id: string;
    abstract: string;
    summary: string;
    tagIds: string[];
    issueId: string;
    sections: Array<{id: string; articleIds: string[]}>;
    pendingNewTagNames: string[];
  }): boolean {
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

    let url: string;
    if (this.#journalIssue && this.#journalIssue.isDraft()) {
      url = "api/blog/post_issue";
    } else {
      url = "api/blog/update_journal_issue";
    }
    Api.asyncRawPost(url, fd, (r: string) => this.#onSubmitRRR(r),
                     (_r: unknown) => this.#onAsyncPostError(_r));
    return true;
  }

  #lockActionBtns(): void { this.#btnSubmit.disable(); }

  #unlockActionBtns(): void { this.#btnSubmit.enable(); }

  #asyncGetTags(ownerId: string): void {
    let url = "api/blog/available_tags?from=" + ownerId;
    Api.asFragmentCall(this, url).then((d: {tags: unknown[]}) => this.#onTagsRRR(d));
  }

  #onTagsRRR(data: {tags: unknown[]}): void {
    this.#tags = [];
    for (let d of data.tags) {
      this.#tags.push(new Tag(d));
    }
    this.#fTags.render();
  }

  #onSubmitRRR(responseText: string): void {
    let response: {error?: unknown; data?: {groups: unknown; journal_issue: unknown}} = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInFragment(this, response.error);
      this.#unlockActionBtns();
    } else {
      if (response.data) {
        WebConfig.setGroups(response.data.groups);
        (this._delegate as any).onJournalIssueUpdatedInJournalIssueEditorFragment(
            this, new JournalIssue(response.data.journal_issue));
      }
    }
  }

  #onAsyncPostError(_dummy: unknown): void {
    this.onLocalErrorInFragment(this, R.get("EL_API_POST"));
    this.#unlockActionBtns();
  }
};
