const _CPT_JOURNAL = {
  NARROW_MAIN : `<div class="h100 flex x-scroll x-scroll-snap">
  <div class="w90 pad5px flex-noshrink scroll-snap-start">
    <div id="__ID_LEFT__" class="h100 s-csecondarybg bdradius25px"></div>
  </div>
  <div class="w90 flex-noshrink scroll-snap-center flex flex-column hide-overflow">
    <div class="h60 top-pad5px hide-overflow">
      <div id="__ID_MAIN__" class="h100 s-csecondarybg bdradius25px y-scroll no-scrollbar"></div>
    </div>
    <div class="h40 v-pad5px">
      <div id="__ID_BOTTOM__" class="h100 s-csecondarybg bdradius25px"></div>
    </div>
  </div>
  <div class="w90 pad5px flex-noshrink scroll-snap-end">
    <div id="__ID_RIGHT__" class="h100 s-csecondarybg bdradius25px"></div>
  </div>
  </div>`,
  MIDDLE_MAIN : `<div class="h100 flex x-scroll x-scroll-snap">
  <div class="w240px pad5px flex-noshrink scroll-snap-start">
    <div id="__ID_LEFT__" class="h100 s-csecondarybg bdradius25px"></div>
  </div>
  <div class="w360px flex-noshrink scroll-snap-center flex flex-column hide-overflow">
    <div class="h60 top-pad5px hide-overflow">
      <div id="__ID_MAIN__" class="h100 s-csecondarybg bdradius25px y-scroll no-scrollbar"></div>
    </div>
    <div class="h40 v-pad5px">
      <div id="__ID_BOTTOM__" class="h100 s-csecondarybg bdradius25px"></div>
    </div>
  </div>
  <div class="w240px pad5px flex-noshrink scroll-snap-end">
    <div id="__ID_RIGHT__" class="h100 s-csecondarybg bdradius25px"></div>
  </div>
  </div>`,
  WIDE_MAIN : `<div class="h100 grid grid3col232">
  <div class="pad5px">
    <div id="__ID_LEFT__" class="h100 s-csecondarybg bdradius25px"></div>
  </div>
  <div class="flex flex-column hide-overflow">
    <div class="h60 top-pad5px hide-overflow">
      <div id="__ID_MAIN__" class="h100 s-csecondarybg bdradius25px y-scroll no-scrollbar"></div>
    </div>
    <div class="h40 v-pad5px">
      <div id="__ID_BOTTOM__" class="h100 s-csecondarybg bdradius25px"></div>
    </div>
  </div>
  <div class="pad5px">
    <div id="__ID_RIGHT__" class="h100 s-csecondarybg bdradius25px"></div>
  </div>
  </div>`,
} as const;

import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { FrontPageLayoutConfig } from '../../common/datatypes/FrontPageLayoutConfig.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FHomeBtn } from '../../session/FHomeBtn.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { FJournalMenu } from './FJournalMenu.js';
import { SearchIconOperator } from '../../lib/ui/animators/SearchIconOperator.js';
import { ICON } from '../../common/constants/Icons.js';
import { FSearchMenu } from '../../common/search/FSearchMenu.js';
import { OwnerJournalIssueIdLoader } from '../blog/OwnerJournalIssueIdLoader.js';
import { FPostInfo } from '../blog/FPostInfo.js';
import { FTaggedCommentList } from '../blog/FTaggedCommentList.js';
import { Blog } from '../../common/dba/Blog.js';
import type { JournalPageConfig } from '../../common/datatypes/JournalPageConfig.js';
import type { Post } from '../../common/datatypes/Post.js';
import type { JournalIssue } from '../../common/datatypes/JournalIssue.js';

export class PJournal extends Panel {
  #pMain: PanelWrapper;
  #pLeft: PanelWrapper;
  #pRight: PanelWrapper;
  #pBottom: PanelWrapper;
  #sTemplate: string | null = null;

  constructor() {
    super();
    this.#pMain = new PanelWrapper();
    this.#pLeft = new PanelWrapper();
    this.#pRight = new PanelWrapper();
    this.#pBottom = new PanelWrapper();
  }

  getMainPanel(): PanelWrapper { return this.#pMain; }
  getLeftCommentPanel(): PanelWrapper { return this.#pLeft; }
  getRightCommentPanel(): PanelWrapper { return this.#pRight; }
  getBottomCommentPanel(): PanelWrapper { return this.#pBottom; }

  setTemplate(t: string): void { this.#sTemplate = t; }

  _renderFramework(): string {
    if (!this.#sTemplate) {
      return "";
    }
    let s = this.#sTemplate;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_LEFT__", this._getSubElementId("L"));
    s = s.replace("__ID_RIGHT__", this._getSubElementId("R"));
    s = s.replace("__ID_BOTTOM__", this._getSubElementId("B"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pMain.attach(this._getSubElementId("M"));
    this.#pLeft.attach(this._getSubElementId("L"));
    this.#pRight.attach(this._getSubElementId("R"));
    this.#pBottom.attach(this._getSubElementId("B"));
  }
};

export class FvcJournal extends FViewContentBase {
  static #T_WIDTH = {
    NARROW : Symbol(),
    MIDDLE: Symbol(),
    WIDE: Symbol(),
  };

  #fHome: FHomeBtn;
  #fmJournal: FHeaderMenu;
  #mJournal: FJournalMenu;
  #fmSearch: FHeaderMenu;
  #fcPanels: FFragmentList;
  #resizeObserver: ResizeObserver;
  #currentMenuItem: string | null = null;
  #tWidth: symbol | null = null;
  #cData: JournalPageConfig | null = null;
  #cLayout: FrontPageLayoutConfig | null = null;
  #idLoader: OwnerJournalIssueIdLoader;
  #fIssue: FPostInfo;
  #fLeft: FTaggedCommentList;
  #fRight: FTaggedCommentList;
  #fBottom: FTaggedCommentList;
  #issueId: string = "67c1fd67c6f59589e72deb0f";

  constructor() {
    super();
    this.#fHome = new FHomeBtn();
    this.#fHome.setUrl(WebConfig.getHomeUrl());

    this.#fmJournal = new FHeaderMenu();
    this.#mJournal = new FJournalMenu();
    this.#mJournal.setDelegate(this);
    this.#fmJournal.setContentFragment(this.#mJournal);
    this.#fmJournal.setExpandableInNarrowHeader(true);

    this.#fmSearch = new FHeaderMenu();
    this.#fmSearch.setIcon(ICON.M_SEARCH, new SearchIconOperator());
    let f = new FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);
    this.#fmSearch.setExpansionPriority(1);

    this.#idLoader = new OwnerJournalIssueIdLoader();
    this.#idLoader.setDelegate(this);

    this.#fIssue = new FPostInfo();
    this.#fIssue.setSizeType(SocialItem.T_LAYOUT.EXT_FULL_PAGE);
    this.setChild("issue", this.#fIssue);

    this.#fLeft = new FTaggedCommentList();
    this.#fRight = new FTaggedCommentList();
    this.#fBottom = new FTaggedCommentList();

    this.#fcPanels = new FFragmentList();
    this.setChild("commentPanelFragments", this.#fcPanels);

    this.setPreferredWidth({"min" : 320, "best" : 2048, "max" : 0});
    this.setMaxWidthClassName(null);

    this.#resizeObserver = new ResizeObserver(() => this.#onResize());
  }

  getHeaderDefaultNavFragment(): FHomeBtn { return this.#fHome; }
  getMenuFragments(): FHeaderMenu[] { return [ this.#fmJournal, this.#fmSearch ]; }

  setConfig(cData: JournalPageConfig, cLayout: FrontPageLayoutConfig): void {
    this.#cData = cData;
    this.#cLayout = cLayout;
    this.#mJournal.setJournalIds([ this.#cData.getJournalId() ]);
  }

  reload(): void {}

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.POST:
      this.#onPostUpdate(data as Post);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Panel): void {
    if (!this.#cLayout) {
      render.replaceContent("Error: Unspecificed layout");
      return;
    }

    let t = this.#cLayout.getType();
    switch (t) {
    case FrontPageLayoutConfig.T_LAYOUT.TRIPLE:
      this.#renderTripleOnRender(render);
      break;
    default:
      render.replaceContent("Error: Unsupported layout type");
      break;
    }
  }

  #renderTripleOnRender(render: Panel): void {
    let panel = this.#createPanel();
    render.wrapPanel(panel);

    let e = panel.getDomElement();
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(e);

    // let jid = this.#cData.getJournalId();
    let issue = Blog.getJournalIssue(this.#issueId);
    if (!issue) {
      return;
    }

    let p = panel.getMainPanel();
    this.#fIssue.setPostId(
        new SocialItemId(this.#issueId, SocialItem.TYPE.JOURNAL_ISSUE));
    this.#fIssue.attachRender(p);
    this.#fIssue.render();

    this.#fcPanels.clear();
    this.#fcPanels.attachRender(panel);

    p = panel.getLeftCommentPanel();
    let tagId = this.#cLayout.getLeftValue();
    this.#fLeft.setTagId(tagId);
    this.#fLeft.attachRender(p);
    this.#fcPanels.append(this.#fLeft);

    tagId = this.#cLayout.getRightValue();
    p = panel.getRightCommentPanel();
    this.#fRight.setTagId(tagId);
    this.#fRight.attachRender(p);
    this.#fcPanels.append(this.#fRight);

    tagId = this.#cLayout.getBottomValue();
    p = panel.getBottomCommentPanel();
    this.#fBottom.setTagId(tagId);
    this.#fBottom.attachRender(p);
    this.#fcPanels.append(this.#fBottom);

    this.#updateComments();
  }

  #updateComments(): void {
    let issue = Blog.getJournalIssue(this.#issueId);
    if (!issue) {
      return;
    }

    this.#fLeft.setCommentIds(
        this.#getTaggedCommentIds(issue, this.#fLeft.getTagId()));
    this.#fLeft.render();

    this.#fRight.setCommentIds(
        this.#getTaggedCommentIds(issue, this.#fRight.getTagId()));
    this.#fRight.render();

    this.#fBottom.setCommentIds(
        this.#getTaggedCommentIds(issue, this.#fBottom.getTagId()));
    this.#fBottom.render();
  }

  #onPostUpdate(post: Post): void {
    let id = post.getId();
    if (id == this.#issueId) {
      this.render();
    } else {
      let issue = Blog.getJournalIssue(this.#issueId);
      if (!issue) {
        return;
      }
      if (issue.containsPost(id)) {
        this.#updateComments();
      }
    }
  }

  #getWidthType(): symbol | null {
    let r = this.getRender();
    if (!r) {
      return null;
    }

    let w = r.getWidth();
    if (w < 400) {
      return FvcJournal.#T_WIDTH.NARROW;
    } else if (w < 840) {
      return FvcJournal.#T_WIDTH.MIDDLE;
    }
    return FvcJournal.#T_WIDTH.WIDE;
  }

  #getTaggedCommentIds(issue: JournalIssue, tagId: string | null): SocialItemId[] {
    if (!tagId) {
      return [];
    }
    let ids = issue.getTaggedCommentIds(tagId);
    for (let s of issue.getSections()) {
      for (let sid of s.getPostSocialIds()) {
        let post = Blog.getPost(sid);
        if (post) {
          for (let id of post.getTaggedCommentIds(tagId)) {
            ids.push(id);
          }
        }
      }
    }
    return ids;
  }

  #createPanel(): PJournal {
    this.#tWidth = this.#getWidthType();
    let panel = new PJournal();
    switch (this.#tWidth) {
    case FvcJournal.#T_WIDTH.WIDE:
      panel.setTemplate(_CPT_JOURNAL.WIDE_MAIN);
      break;
    case FvcJournal.#T_WIDTH.MIDDLE:
      panel.setTemplate(_CPT_JOURNAL.MIDDLE_MAIN);
      break;
    case FvcJournal.#T_WIDTH.NARROW:
      panel.setTemplate(_CPT_JOURNAL.NARROW_MAIN);
      break;
    default:
      panel.setTemplate(_CPT_JOURNAL.NARROW_MAIN);
      break;
    }
    panel.setClassName("h100 s-csecondarydecorbg");
    return panel;
  }

  #onResize(): void {
    if (this.#getWidthType() != this.#tWidth) {
      // Needs time timeout, don't know root cause yet, maybe related to
      // animation
      setTimeout(() => { this.render(); }, 100);
    }
  }
};
