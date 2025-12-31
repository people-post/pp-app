export const CF_BRIEF = {
  SHOW_CALENDAR : Symbol(),
};

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
};

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
import { MenuItem } from '../../common/datatypes/MenuItem.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';

export class PBriefBase extends Panel {
  getBannerPanel() { return null; }
  getPostsPanel() { return null; }
  getCalendarBtnPanel() { return null; }
  getCalendarTitlePanel() { return null; }
  getCalendarPanel() { return null; }
  getPinnedTitlePanel() { return null; }
  getPinnedHPanel() { return null; }
  getPinnedVPanel() { return null; }
  getSocialLinksPanel() { return null; }
  getCopyrightsPanel() { return null; }
};

class PBriefNarrow extends PBriefBase {
  #pBanner;
  #pPosts;
  #pCalendarBtn;
  #pPinnedTitle;
  #pPinned;
  #pSocialLinks;
  #pCopyrights;
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

  getBannerPanel() { return this.#pBanner; }
  getPostsPanel() { return this.#pPosts; }
  getCalendarBtnPanel() { return this.#pCalendarBtn; }
  getPinnedTitlePanel() { return this.#pPinnedTitle; }
  getPinnedHPanel() { return this.#pPinned; }
  getSocialLinksPanel() { return this.#pSocialLinks; }
  getCopyrightsPanel() { return this.#pCopyrights; }

  _renderFramework() {
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

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pBanner.attach(this._getSubElementId("B"));
    this.#pPosts.attach(this._getSubElementId("P"));
    this.#pCalendarBtn.attach(this._getSubElementId("C"));
    this.#pPinnedTitle.attach(this._getSubElementId("T"));
    this.#pPinned.attach(this._getSubElementId("U"));
    this.#pSocialLinks.attach(this._getSubElementId("S"));
    this.#pCopyrights.attach(this._getSubElementId("R"));
  }
};

class PBriefWide extends PBriefBase {
  #pBanner;
  #pPosts;
  #pCalendarTitle;
  #pCalendar;
  #pPinnedTitle;
  #pPinned;
  #pSocialLinks;
  #pCopyrights;
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

  getBannerPanel() { return this.#pBanner; }
  getPostsPanel() { return this.#pPosts; }
  getCalendarTitlePanel() { return this.#pCalendarTitle; }
  getCalendarPanel() { return this.#pCalendar; }
  getPinnedTitlePanel() { return this.#pPinnedTitle; }
  getPinnedVPanel() { return this.#pPinned; }
  getSocialLinksPanel() { return this.#pSocialLinks; }
  getCopyrightsPanel() { return this.#pCopyrights; }

  _renderFramework() {
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

  _onFrameworkDidAppear() {
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
};

class FvcBrief extends FViewContentBase {
  static #T_WIDTH = {
    NARROW : Symbol(),
    WIDE: Symbol(),
  };

  #fHome;
  #mMain;
  #fmMain;
  #fmSearch;
  #fmLanguage;
  #fPosts;
  #fPostsHook;
  #fPinnedPosts;
  #fCalendar;
  #currentMenuItem = null;
  #resizeObserver;
  #config = null;
  #loader;
  #lc;
  #tWidth = null;
  #selectedDate = "";
  #fBtnDonate = null;
  #fAbg;

  constructor() {
    super();
    this.#fHome = new main.FHomeBtn();
    this.#fHome.setUrl(dba.WebConfig.getHomeUrl());

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
        srch.FSearchResultInfo.T_LAYOUT.BRIEF);
    this.#mMain.setDelegate(this);
    this.#fmMain.setContentFragment(this.#mMain);

    this.#fmSearch = new FHeaderMenu();
    this.#fmSearch.setIcon(ICON.M_SEARCH, new SearchIconOperator());
    let f = new srch.FSearchMenu();
    f.setResultLayoutType(srch.FSearchResultInfo.T_LAYOUT.BRIEF);
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);
    this.#fmSearch.setExpansionPriority(1);

    this.#fmLanguage = new FHeaderMenu();
    this.#fmLanguage.setIcon(Utilities.renderSvgMenuIcon(ICON.LANGUAGE));
    this.#fmLanguage.setDelegate(this);

    this.#lc = new LContext();
    this.#lc.setDelegate(this);

    this.#loader = new blog.OwnerPostIdLoader();
    this.#loader.setDelegate(this);
    this.#fPosts = new blog.FPostList();
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

  getHeaderDefaultNavFragment() { return this.#fHome; }
  getMenuFragments() { return [ this.#fmMain, this.#fmSearch ]; }
  // getHeaderLayoutType() { return ui.FViewHeader.T_LAYOUT.THICK; }

  getActionButton() { return this.#fAbg; }

  onGuiActionButtonClick(fActionButton) {
    switch (fActionButton) {
    case this.#fBtnDonate:
      this.#onShowDonation();
      break;
    default:
      break;
    }
  }

  setOwnerId(id) {
    this.#loader.setOwnerId(id);
    this.#mMain.setOwnerId(id);
  }
  setConfig(c) { this.#config = c; }

  initFromUrl(urlParam) {
    let id = urlParam.get(URL_PARAM.ID);
    if (id) {
      this.#showBriefArticle(SocialItemId.fromEncodedStr(id));
    }
  }

  onInfoFragmentCreatedInPostListFragment(fPosts, fInfo) {
    fInfo.setSizeType(SocialItem.T_LAYOUT.EXT_BRIEF);
  }
  onClickInHeaderMenuFragment(fHeaderMenu) {
    if (fHeaderMenu == this.#fmLanguage) {
      this.#lc.setTargetName("language");
      this.#lc.clearOptions();
      this.#lc.addOption("English", "en-us");
      this.#lc.addOption("中文", "zh-cn");
      fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this.#lc,
                                  "Context");
    }
  }
  onIdUpdatedInLongListIdLoader(loader) {
    switch (loader) {
    case this.#loader:
      this.#fPosts.onScrollFinished();
      break;
    default:
      break;
    }
  }

  onItemSelectedInGuiMainMenu(fMainMenu, menuItem) {
    if (menuItem.getId() == "ZHUANTI") {
      let v = new View();
      let f = new ftpg.FvcInsights();
      v.setContentFragment(f);
      this._owner.onFragmentRequestShowView(this, v, "insights");
    } else {
      this.#prepare(menuItem);
      this.#applyTheme();

      this.#fmMain.close();
      fwk.Events.triggerTopAction(fwk.T_ACTION.REPLACE_STATE, {}, "posts");
    }
  }
  onOptionClickedInContextLayer(lc, value) { this.#setLanguage(value); }
  onDateSelectorRequestClearDate(fDate) {}
  onDateSelectedInDateSelector(fDate, date) {
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

  action(type, ...args) {
    switch (type) {
    case ftpg.CF_BRIEF.SHOW_CALENDAR:
      this.#onShowCalendar();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PROFILE:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let panel = this.#createPanel();
    panel.setClassName("h100");
    render.wrapPanel(panel);

    let e = panel.getDomElement();
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(e);

    let p = panel.getPostsPanel();
    this.#fPostsHook.attachRender(p);
    this.#fPostsHook.render();

    this.#renderBanner(panel.getBannerPanel());
    this.#renderCalendarBtn(panel.getCalendarBtnPanel());
    this.#renderCalendarTitle(panel.getCalendarTitlePanel());
    this.#renderCalendar(panel.getCalendarPanel());

    let ids = [];
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
        let f = new blog.FPostInfo();
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
        let f = new blog.FPostInfo();
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

  #setLanguage(code) { console.log("Language: " + code); }

  #getTagIds() {
    return this.#currentMenuItem ? this.#currentMenuItem.getTagIds() : [];
  }

  #getWidthType() {
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

  #createPanel() {
    this.#tWidth = this.#getWidthType();
    let panel;
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

  #prepare(menuItem) {
    if (this.#currentMenuItem != menuItem) {
      this.#currentMenuItem = menuItem;
      this.#loader.setTagIds(this.#getTagIds());
      this.#fPosts.reset();
    }
  }

  #applyTheme() {
    dba.WebConfig.setThemeId(
        this.#currentMenuItem ? this.#currentMenuItem.getId() : null);
  }

  #showBriefArticle(sid) {
    let v = new View();
    let f = new blog.FvcOwnerPostScroller();
    let a = dba.Blog.getArticle(sid.getValue());
    if (a) {
      f.setOwnerId(a.getOwnerId());
    }
    f.setAnchorPostId(sid);
    v.setContentFragment(f);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Article");
  }

  #renderBanner(panel) {
    if (!panel) {
      return;
    }
    // panel.replaceContent("Banner");
  }

  #renderCalendarBtn(panel) {
    if (!panel) {
      return;
    }
    panel.setAttribute("onclick",
                       `javascript:G.action(ftpg.CF_BRIEF.SHOW_CALENDAR)`);
    let title = "选择日期查看简讯";
    if (this.#selectedDate != "")
      title = this.#selectedDate;
    let s = _CPT_BRIEF.TITLE;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ICON.CALENDAR));
    s = s.replace("__TEXT__", title);
    panel.replaceContent(s);
  }

  #renderCalendarTitle(panel) {
    if (!panel) {
      return;
    }
    let s = _CPT_BRIEF.TITLE;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ICON.CALENDAR));
    s = s.replace("__TEXT__", "选择日期查看简讯");
    panel.replaceContent(s);
  }

  #renderCalendar(panel) {
    if (!panel) {
      return;
    }
    this.#fCalendar.attachRender(panel);
    this.#fCalendar.render();
  }

  #renderPinnedTitle(panel) {
    if (!panel) {
      return;
    }
    let s = _CPT_BRIEF.TITLE;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ICON.FIRE));
    s = s.replace("__TEXT__", "热门简讯");
    panel.replaceContent(s);
  }

  #renderSocialLinks(panel) {
    if (!panel) {
      return;
    }
    panel.replaceContent("Follow NFSC Brief on ");
  }

  #renderCopyrights(panel) {
    if (!panel) {
      return;
    }
    let s = _CPT_BRIEF.COPYRIGHTS;
    panel.replaceContent(s);
  }

  #onResize() {
    if (this.#getWidthType() != this.#tWidth) {
      // Needs time timeout, don't know root cause yet, maybe related to
      // animation
      setTimeout(() => { this.render(); }, 100);
    }
  }

  #onShowCalendar() {
    this.#lc.setTargetName("date");
    this.#lc.clearOptions();
    this.#lc.addOptionFragment(this.#fCalendar);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }

  #onShowDonation() {
    let v = new View();
    let f = new ftpg.FvcBriefDonation();
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "donation");
  }
};

ftpg.FvcBrief = FvcBrief;


// Backward compatibility
if (typeof window !== 'undefined') {
  window.ftpg = window.ftpg || {};
  window.ftpg.CF_BRIEF = CF_BRIEF;
}