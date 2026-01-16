export const CF_BRIEF = {
  SHOW_CALENDAR : Symbol(),
};

// Make available on window for HTML string templates
if (typeof window !== 'undefined') {
  (window as { CF_BRIEF?: typeof CF_BRIEF }).CF_BRIEF = CF_BRIEF;
}

const _CPT_BRIEF = {
  TITLE :
      `<span class="inline-block s-icon5 v-bottom-align">__ICON__</span><span class="v-bottom-align">__TEXT__</span>`,
  COPYRIGHTS :
      `<span>Copyright 2025 NFSC Brief. All rights reserved. The NFSC Brief is not responsible for the content of external sites.</span><span class="bold"> Read about our approach to external linking.</span>`,
  NARROW_MAIN : `<div class="pad10px h100 y-scroll no-scrollbar">
    <div id="__ID_BANNER__">Banner</div>
    <div id="__ID_PINNED_TITLE__"></div>
    <div id="__ID_PINNED_H__" class="flex flex-start x-scroll no-scrollbar x-scroll-snap"></div>
    <div id="__ID_CALENDAR_BTN__" class="clickable s-font3 v-pad5px"></div>
    <div id="__ID_POSTS__" class="h100 font-song"></div>
    <hr>
    <div class="center-align">
      <span class="s-font1 bold">NFSC Brief</span>
      <span class="s-font3">24hr</span>
    </div>
    <div id="__ID_SOCIAL__" class="s-font4 bold"></div>
    <br>
    <div id="__ID_COPYRIGHTS__" class="s-font5"></div>
    <br>
  </div>`,
  WIDE_MAIN : `<div class="h100 y-scroll no-scrollbar">
    <div id="__ID_BANNER__"></div>
    <div class="h100 flex flex-center hide-overflow">
      <div id="__ID_POSTS__" class="h100 pad5px flex-grow font-song"></div>
      <div class="w240px pad5px bd-l-1px bd-l-solid bdlightgray flex-noshrink flex flex-column flex-start">
        <div class="flex-noshrink">
          <div id="__ID_CALENDAR_TITLE__" class="s-font3"></div>
          <div id="__ID_CALENDAR__"></div>
          <div id="__ID_PINNED_TITLE__"></div>
        </div>
        <div id="__ID_PINNED_V__" class="flex-grow hide-overflow"></div>
      </div>
    </div>
    <hr>
    <div class="center-align">
      <span class="s-font1 bold">NFSC Brief</span>
      <span class="s-font3">24hr</span>
    </div>
    <div class="s-font3 bold flex space-between">
      <div>Home</div>
      <div>Focus</div>
      <div>NFSC</div>
      <div>International</div>
      <div>China</div>
      <div>Whisleblow</div>
      <div>About us</div>
    </div>
    <div></div>
    <br>
    <div id="__ID_SOCIAL__" class="s-font4 bold"></div>
    <br>
    <div class="s-font5 flex flex-start">
      <div>Term of Use</div>
      <div>About us</div>
      <div>Privacy Policy</div>
      <div>Cookies</div>
      <div>Accessibility Help</div>
      <div>Contact us</div>
    </div>
    <br>
    <div id="__ID_COPYRIGHTS__" class="s-font5"></div>
    <br>
  </div>`,
} as const;

import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { FScrollableHook } from '../../lib/ui/controllers/fragments/FScrollableHook.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { FDateSelector } from '../../lib/ui/controllers/fragments/FDateSelector.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ID, URL_PARAM } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { ActionButtonGroup } from '../../common/gui/ActionButtonGroup.js';
import { MainMenu } from '../../common/menu/MainMenu.js';
import { MainIconOperator } from '../../lib/ui/animators/MainIconOperator.js';
import { SearchIconOperator } from '../../lib/ui/animators/SearchIconOperator.js';
import { MenuItem } from '../../common/datatypes/MenuItem.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/interface/SocialItem.js';
import { FHomeBtn } from '../../session/FHomeBtn.js';
import { FvcInsights } from './FvcInsights.js';
import { FvcBriefDonation } from './FvcBriefDonation.js';
import { OwnerPostIdLoader } from '../blog/OwnerPostIdLoader.js';
import { FPostList } from '../blog/FPostList.js';
import { FPostInfo } from '../blog/FPostInfo.js';
import { FvcOwnerPostScroller } from '../blog/FvcOwnerPostScroller.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Blog } from '../../common/dba/Blog.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { Utilities } from '../../common/Utilities.js';
import { FSearchMenu } from '../../common/search/FSearchMenu.js';
import { FSearchResultInfo } from '../../common/search/FSearchResultInfo.js';
import type { ActionButton as ActionButtonType } from '../../common/gui/ActionButton.js';
import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import type Render from '../../lib/ui/renders/Render.js';

export class PBriefBase extends Panel {
  getBannerPanel(): Panel | null { return null; }
  getPostsPanel(): Panel | null { return null; }
  getCalendarBtnPanel(): Panel | null { return null; }
  getCalendarTitlePanel(): Panel | null { return null; }
  getCalendarPanel(): Panel | null { return null; }
  getPinnedTitlePanel(): Panel | null { return null; }
  getPinnedHPanel(): ListPanel | null { return null; }
  getPinnedVPanel(): ListPanel | null { return null; }
  getSocialLinksPanel(): Panel | null { return null; }
  getCopyrightsPanel(): Panel | null { return null; }
}

class PBriefNarrow extends PBriefBase {
  #pBanner: PanelWrapper;
  #pPosts: PanelWrapper;
  #pCalendarBtn: PanelWrapper;
  #pPinnedTitle: PanelWrapper;
  #pPinned: ListPanel;
  #pSocialLinks: PanelWrapper;
  #pCopyrights: PanelWrapper;
  constructor() {
    super();
    this.#pBanner = new PanelWrapper();
    this.#pPosts = new PanelWrapper();
    this.#pCalendarBtn = new PanelWrapper();
    this.#pPinnedTitle = new PanelWrapper();
    this.#pPinned = new ListPanel();
    this.#pSocialLinks = new PanelWrapper();
    this.#pCopyrights = new PanelWrapper();
  }

  getBannerPanel(): PanelWrapper { return this.#pBanner; }
  getPostsPanel(): PanelWrapper { return this.#pPosts; }
  getCalendarBtnPanel(): PanelWrapper { return this.#pCalendarBtn; }
  getPinnedTitlePanel(): PanelWrapper { return this.#pPinnedTitle; }
  getPinnedHPanel(): ListPanel { return this.#pPinned; }
  getSocialLinksPanel(): PanelWrapper { return this.#pSocialLinks; }
  getCopyrightsPanel(): PanelWrapper { return this.#pCopyrights; }

  _renderFramework(): string {
    let s = _CPT_BRIEF.NARROW_MAIN;
    s = s.replace("__ID_BANNER__", this._getSubElementId("B"));
    s = s.replace("__ID_POSTS__", this._getSubElementId("P"));
    s = s.replace("__ID_CALENDAR_BTN__", this._getSubElementId("C"));
    s = s.replace("__ID_PINNED_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_PINNED_H__", this._getSubElementId("U"));
    s = s.replace("__ID_SOCIAL__", this._getSubElementId("S"));
    s = s.replace("__ID_COPYRIGHTS__", this._getSubElementId("R"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pBanner.attach(this._getSubElementId("B"));
    this.#pPosts.attach(this._getSubElementId("P"));
    this.#pCalendarBtn.attach(this._getSubElementId("C"));
    this.#pPinnedTitle.attach(this._getSubElementId("T"));
    this.#pPinned.attach(this._getSubElementId("U"));
    this.#pSocialLinks.attach(this._getSubElementId("S"));
    this.#pCopyrights.attach(this._getSubElementId("R"));
  }
}

class PBriefWide extends PBriefBase {
  #pBanner: PanelWrapper;
  #pPosts: PanelWrapper;
  #pCalendarTitle: PanelWrapper;
  #pCalendar: PanelWrapper;
  #pPinnedTitle: PanelWrapper;
  #pPinned: ListPanel;
  #pSocialLinks: PanelWrapper;
  #pCopyrights: PanelWrapper;
  constructor() {
    super();
    this.#pBanner = new PanelWrapper();
    this.#pPosts = new PanelWrapper();
    this.#pCalendarTitle = new PanelWrapper();
    this.#pCalendar = new PanelWrapper();
    this.#pPinnedTitle = new PanelWrapper();
    this.#pPinned = new ListPanel();
    this.#pSocialLinks = new PanelWrapper();
    this.#pCopyrights = new PanelWrapper();
  }

  getBannerPanel(): PanelWrapper { return this.#pBanner; }
  getPostsPanel(): PanelWrapper { return this.#pPosts; }
  getCalendarTitlePanel(): PanelWrapper { return this.#pCalendarTitle; }
  getCalendarPanel(): PanelWrapper { return this.#pCalendar; }
  getPinnedTitlePanel(): PanelWrapper { return this.#pPinnedTitle; }
  getPinnedVPanel(): ListPanel { return this.#pPinned; }
  getSocialLinksPanel(): PanelWrapper { return this.#pSocialLinks; }
  getCopyrightsPanel(): PanelWrapper { return this.#pCopyrights; }

  _renderFramework(): string {
    let s = _CPT_BRIEF.WIDE_MAIN;
    s = s.replace("__ID_BANNER__", this._getSubElementId("B"));
    s = s.replace("__ID_POSTS__", this._getSubElementId("P"));
    s = s.replace("__ID_CALENDAR_TITLE__", this._getSubElementId("CT"));
    s = s.replace("__ID_CALENDAR__", this._getSubElementId("C"));
    s = s.replace("__ID_PINNED_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_PINNED_V__", this._getSubElementId("U"));
    s = s.replace("__ID_SOCIAL__", this._getSubElementId("S"));
    s = s.replace("__ID_COPYRIGHTS__", this._getSubElementId("R"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pBanner.attach(this._getSubElementId("B"));
    this.#pPosts.attach(this._getSubElementId("P"));
    this.#pCalendarTitle.attach(this._getSubElementId("CT"));
    this.#pCalendar.attach(this._getSubElementId("C"));
    this.#pPinnedTitle.attach(this._getSubElementId("T"));
    this.#pPinned.attach(this._getSubElementId("U"));
    this.#pSocialLinks.attach(this._getSubElementId("S"));
    this.#pCopyrights.attach(this._getSubElementId("R"));
  }
}

export class FvcBrief extends FViewContentBase {
  static readonly #T_WIDTH = {
    NARROW : Symbol(),
    WIDE: Symbol(),
  } as const;

  #fHome: FHomeBtn;
  #mMain: MainMenu;
  #fmMain: FHeaderMenu;
  #fmSearch: FHeaderMenu;
  #fmLanguage: FHeaderMenu;
  #fPosts: FPostList;
  #fPostsHook: FScrollableHook;
  #fPinnedPosts: FFragmentList;
  #fCalendar: FDateSelector;
  #currentMenuItem: MenuItem | null = null;
  #resizeObserver: ResizeObserver;
  #config: unknown = null;
  #loader: OwnerPostIdLoader;
  #lc: LContext;
  #tWidth: symbol | null = null;
  #selectedDate: string = "";
  #fBtnDonate: ActionButton | null = null;
  #fAbg: ActionButtonGroup;

  constructor() {
    super();
    this.#fHome = new FHomeBtn();
    this.#fHome.setUrl(WebConfig.getHomeUrl());

    this.#fmMain = new FHeaderMenu();
    this.#fmMain.setIcon(ICON.M_MENU, new MainIconOperator());
    this.#fmMain.setExpansionPriority(0);

    this.#mMain = new MainMenu();
    // right-pad120px is a hack because of the icon is too wide, needs better
    // fix
    this.#mMain.setMaxWidthClass("wmax800px right-pad120px");
    this.#mMain.setSector(ID.SECTOR.BLOG);
    this.#mMain.setExtraItems(
        [ new MenuItem({"id" : "ZHUANTI", "name" : "专题"}) ]);
    this.#mMain.setSearchResultLayoutType(
        FSearchResultInfo.T_LAYOUT.BRIEF);
    this.#mMain.setDelegate(this);
    this.#fmMain.setContentFragment(this.#mMain);

    this.#fmSearch = new FHeaderMenu();
    this.#fmSearch.setIcon(ICON.M_SEARCH, new SearchIconOperator());
    let f = new FSearchMenu();
    f.setResultLayoutType(FSearchResultInfo.T_LAYOUT.BRIEF);
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);
    this.#fmSearch.setExpansionPriority(1);

    this.#fmLanguage = new FHeaderMenu();
    this.#fmLanguage.setIcon(Utilities.renderSvgMenuIcon(ICON.LANGUAGE));
    this.#fmLanguage.setDelegate(this);

    this.#lc = new LContext();
    this.#lc.setDelegate(this);

    this.#loader = new OwnerPostIdLoader();
    this.#loader.setDelegate(this);
    this.#fPosts = new FPostList();
    this.#fPosts.setDataSource(this);
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(this.#loader);
    this.#fPostsHook = new FScrollableHook(this.#fPosts);
    this.setChild("posts", this.#fPostsHook);

    this.#fPinnedPosts = new FFragmentList();
    this.setChild("pinnedposts", this.#fPinnedPosts);

    this.#fCalendar = new FDateSelector();
    this.#fCalendar.setEnableClear(false);
    this.#fCalendar.setDelegate(this);
    this.setChild("calendar", this.#fCalendar);

    this.setPreferredWidth({"min" : 320, "best" : 2048, "max" : 0});
    this.#resizeObserver = new ResizeObserver(() => this.#onResize());

    this.#fBtnDonate = new ActionButton();
    this.#fBtnDonate.setIcon(ActionButton.T_ICON.DONATE);
    this.#fBtnDonate.setDelegate(this);

    this.#fAbg = new ActionButtonGroup();
    this.#fAbg.append(this.#fBtnDonate);
  }

  getHeaderDefaultNavFragment(): Fragment { return this.#fHome; }
  getMenuFragments(): Fragment[] { return [ this.#fmMain, this.#fmSearch ]; }
  // getHeaderLayoutType() { return ui.FViewHeader.T_LAYOUT.THICK; }

  getActionButton(): ActionButtonType | null { return this.#fAbg; }

  onGuiActionButtonClick(fActionButton: ActionButton): void {
    switch (fActionButton) {
    case this.#fBtnDonate:
      this.#onShowDonation();
      break;
    default:
      break;
    }
  }

  setOwnerId(id: string | null): void {
    this.#loader.setOwnerId(id);
    this.#mMain.setOwnerId(id);
  }
  setConfig(c: unknown): void { this.#config = c; }

  initFromUrl(urlParam: URLSearchParams): void {
    let id = urlParam.get(URL_PARAM.ID);
    if (id) {
      this.#showBriefArticle(SocialItemId.fromEncodedStr(id));
    }
  }

  onInfoFragmentCreatedInPostListFragment(_fPosts: FPostList, fInfo: unknown): void {
    const fInfoWithSize = fInfo as { setSizeType?: (size: string) => void };
    if (fInfoWithSize.setSizeType) {
      fInfoWithSize.setSizeType(SocialItem.T_LAYOUT.EXT_BRIEF);
    }
  }
  onClickInHeaderMenuFragment(fHeaderMenu: FHeaderMenu): void {
    if (fHeaderMenu == this.#fmLanguage) {
      this.#lc.setTargetName("language");
      this.#lc.clearOptions();
      this.#lc.addOption("English", "en-us");
      this.#lc.addOption("中文", "zh-cn");
      Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                  "Context");
    }
  }
  onIdUpdatedInLongListIdLoader(_loader: unknown): void {
    this.#fPosts.onScrollFinished();
  }

  onItemSelectedInGuiMainMenu(_fMainMenu: MainMenu, menuItem: MenuItem): void {
    if (menuItem.getId() == "ZHUANTI") {
      let v = new View();
      let f = new FvcInsights();
      v.setContentFragment(f);
      this._owner.onFragmentRequestShowView(this, v, "insights");
    } else {
      this.#prepare(menuItem);
      this.#applyTheme();

      this.#fmMain.close();
      Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, "posts");
    }
  }
  onOptionClickedInContextLayer(_lc: LContext, value: string): void { this.#setLanguage(value); }
  onDateSelectorRequestClearDate(_fDate: FDateSelector): void {}
  onDateSelectedInDateSelector(_fDate: FDateSelector, date: string): void {
    this.#lc.dismiss();
    let tFrom = new Date(date);
    tFrom.setHours(0);
    tFrom.setMinutes(0);
    tFrom.setSeconds(0);
    let tTo = new Date(tFrom);
    tTo.setDate(tFrom.getDate() + 1);
    this.#loader.setFilter(null, tTo);
    this.#fPosts.reset();
    this.#selectedDate = tFrom.toDateString();
    this.render();
  }

  action(type: symbol | string, ...args: unknown[]): void {
    switch (type) {
    case CF_BRIEF.SHOW_CALENDAR:
      this.#onShowCalendar();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    let panel = this.#createPanel();
    panel.setClassName("h100");
    render.wrapPanel(panel);

    let e = panel.getDomElement();
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(e);

    let p = panel.getPostsPanel();
    if (p) {
      this.#fPostsHook.attachRender(p);
      this.#fPostsHook.render();
    }

    this.#renderBanner(panel.getBannerPanel());
    this.#renderCalendarBtn(panel.getCalendarBtnPanel());
    this.#renderCalendarTitle(panel.getCalendarTitlePanel());
    this.#renderCalendar(panel.getCalendarPanel());

    let ids: SocialItemId[] = [];
    for (let idx of [0, 1]) {
      let sid = this.#loader.getIdRecord().getId(idx);
      if (sid) {
        ids.push(SocialItemId.fromEncodedStr(sid));
      }
    }

    this.#fPinnedPosts.clear();
    p = panel.getPinnedHPanel();
    if (p) {
      if (ids.length) {
        this.#renderPinnedTitle(panel.getPinnedTitlePanel());
      }
      this.#fPinnedPosts.attachRender(p);
      for (let id of ids) {
        let pp = new PanelWrapper();
        pp.setClassName(
            "w90 s-csecondarydecorbg flex-noshrink scroll-snap-start h200px y-scroll no-scrollbar");
        p.pushPanel(pp);
        let f = new FPostInfo();
        f.setPostId(id);
        f.setSizeType(SocialItem.T_LAYOUT.EXT_CARD);
        this.#fPinnedPosts.append(f);
        f.attachRender(pp);
        f.render();
      }
    }

    p = panel.getPinnedVPanel();
    if (p) {
      this.#renderPinnedTitle(panel.getPinnedTitlePanel());
      this.#fPinnedPosts.attachRender(p);
      for (let id of ids) {
        let pp = new PanelWrapper();
        p.pushPanel(pp);
        let f = new FPostInfo();
        f.setPostId(id);
        f.setSizeType(SocialItem.T_LAYOUT.EXT_BRIEF);
        this.#fPinnedPosts.append(f);
        f.attachRender(pp);
        f.render();
      }
    }

    this.#renderSocialLinks(panel.getSocialLinksPanel());
    this.#renderCopyrights(panel.getCopyrightsPanel());
  }

  #setLanguage(_code: string): void { console.log("Language: " + _code); }

  #getTagIds(): string[] {
    return this.#currentMenuItem ? this.#currentMenuItem.getTagIds() : [];
  }

  #getWidthType(): symbol | null {
    let r = this.getRender();
    if (!r) {
      return null;
    }

    let w = r.getWidth();
    if (w < 800) {
      return this.constructor.#T_WIDTH.NARROW;
    }
    return this.constructor.#T_WIDTH.WIDE;
  }

  #createPanel(): PBriefBase {
    this.#tWidth = this.#getWidthType();
    let panel: PBriefBase;
    switch (this.#tWidth) {
    case this.constructor.#T_WIDTH.WIDE:
      panel = new PBriefWide();
      break;
    default:
      panel = new PBriefNarrow();
      break;
    }
    return panel;
  }

  #prepare(menuItem: MenuItem): void {
    if (this.#currentMenuItem != menuItem) {
      this.#currentMenuItem = menuItem;
      this.#loader.setTagIds(this.#getTagIds());
      this.#fPosts.reset();
    }
  }

  #applyTheme(): void {
    WebConfig.setThemeId(
        this.#currentMenuItem ? this.#currentMenuItem.getId() : null);
  }

  #showBriefArticle(sid: SocialItemId): void {
    let v = new View();
    let f = new FvcOwnerPostScroller();
    let a = Blog.getArticle(sid.getValue());
    if (a) {
      f.setOwnerId(a.getOwnerId());
    }
    f.setAnchorPostId(sid);
    v.setContentFragment(f);
      Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Article");
  }

  #renderBanner(panel: Panel | null): void {
    if (!panel) {
      return;
    }
    // panel.replaceContent("Banner");
  }

  #renderCalendarBtn(panel: Panel | null): void {
    if (!panel) {
      return;
    }
    panel.setAttribute("onclick",
                       `javascript:G.action(window.CF_BRIEF.SHOW_CALENDAR)`);
    let title = "选择日期查看简讯";
    if (this.#selectedDate != "")
      title = this.#selectedDate;
    let s = _CPT_BRIEF.TITLE;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ICON.CALENDAR));
    s = s.replace("__TEXT__", title);
    panel.replaceContent(s);
  }

  #renderCalendarTitle(panel: Panel | null): void {
    if (!panel) {
      return;
    }
    let s = _CPT_BRIEF.TITLE;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ICON.CALENDAR));
    s = s.replace("__TEXT__", "选择日期查看简讯");
    panel.replaceContent(s);
  }

  #renderCalendar(panel: Panel | null): void {
    if (!panel) {
      return;
    }
    this.#fCalendar.attachRender(panel);
    this.#fCalendar.render();
  }

  #renderPinnedTitle(panel: Panel | null): void {
    if (!panel) {
      return;
    }
    let s = _CPT_BRIEF.TITLE;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ICON.FIRE));
    s = s.replace("__TEXT__", "热门简讯");
    panel.replaceContent(s);
  }

  #renderSocialLinks(panel: Panel | null): void {
    if (!panel) {
      return;
    }
    panel.replaceContent("Follow NFSC Brief on ");
  }

  #renderCopyrights(panel: Panel | null): void {
    if (!panel) {
      return;
    }
    let s = _CPT_BRIEF.COPYRIGHTS;
    panel.replaceContent(s);
  }

  #onResize(): void {
    if (this.#getWidthType() != this.#tWidth) {
      // Needs time timeout, don't know root cause yet, maybe related to
      // animation
      setTimeout(() => { this.render(); }, 100);
    }
  }

  #onShowCalendar(): void {
    this.#lc.setTargetName("date");
    this.#lc.clearOptions();
    this.#lc.addOptionFragment(this.#fCalendar);
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }

  #onShowDonation(): void {
    let v = new View();
    let f = new FvcBriefDonation();
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "donation");
  }
}
