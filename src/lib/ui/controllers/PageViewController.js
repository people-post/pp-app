import { RenderController } from './RenderController.js';
import { FNavigation } from './fragments/FNavigation.js';
import { Page } from './Page.js';
import { T_DATA, T_ACTION, Events } from '../../framework/Events.js';
import { WebConfig } from '../../../common/dba/WebConfig.js';

export class PageViewController extends RenderController {
  #mPageConfig;
  #mPage;
  #currentPage;
  #defaultPageId;
  #fNav;

  constructor() {
    super();
    this.#mPageConfig = new Map(); // All pages with visible tab
    this.#mPage = new Map();       // All pages with visible tab

    this.#fNav = new FNavigation();
    this.#fNav.setDataSource(this);
    this.#fNav.setDelegate(this);
  }

  init(configs) {
    this.#resetPages(configs);
    // This is a hack fix for ViewStack that initially it doesn't show
    // action button correctly in multi frame layout
    this.onResize();
  }

  initFromUrl(urlParam) {
    if (this.#currentPage) {
      this.#currentPage.initFromUrl(urlParam);
    }
  }

  getActiveNavItemIdForNavigationFragment(fNav) {
    return this.getActivePageId();
  }
  getNavItemsForNavigationFragment(fNav) {
    let items = [];
    for (let c of this.#mPageConfig.values()) {
      items.push({
        ID : c.ID,
        ICON : c.ICON,
        NNOTIFICATIONS :
            this._dataSource.getNPageNotificationsForPageViewController(this,
                                                                        c.ID),
        IS_OPEN_ADDON :
            this._dataSource.isPageNavPageInPageViewController(this, c.ID),
      });
    }
    return items;
  }

  getUrlParamString() {
    return this.#currentPage ? this.#currentPage.getUrlParamString() : "";
  }
  getActivePageId() {
    return this.#currentPage ? this.#currentPage.getPageId() : null;
  }

  setDefaultPageId(id) { this.#defaultPageId = id; }

  onViewStackStackSizeChange(nc) {
    this._delegate.onPageViewControllerOverlayPermissionChange(
        this, this.#isOverlayAllowed());
  }

  onNavPageSelectedInNavigationFragment(fNav, pageId) {
    this.switchToPage(pageId);
  }

  onViewStackRequestPopView(nc) {
    if (nc == this.#currentPage) {
      this._owner.onPageViewControllerRequestPopView(this);
    }
  }

  onResize() {
    if (this.#currentPage) {
      this.#currentPage.onResize();
    }
  }

  replaceNavWrapperPanel(panel) {
    this.attachExtraRender("nav", panel);
    this.#fNav.attachRender(panel);
    this.#updateNavView();
  }

  pushView(view, title) {
    if (this.#currentPage) {
      this.#currentPage.pushView(view, title);
    }
  }

  popState(state) {
    if (this.#currentPage) {
      this.#currentPage.popState(state);
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.WEB_CONFIG:
      this.#updateNavView();
      break;
    case T_DATA.NOTIFICATIONS:
      this.#updateNavView();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  switchToDefaultPage() { this.switchToPage(this.#defaultPageId); }
  switchToPage(rawPageId) {
    let pageId = rawPageId;
    if (!this.#mPageConfig.has(pageId)) {
      pageId = this.#defaultPageId;
      // Even default may not exist
      if (!this.#mPageConfig.has(pageId)) {
        pageId = this.#mPageConfig.keys().next().value;
        // Notice pageId can still not exist, will be handled later.
      }
    }
    if (this.#currentPage && this.getActivePageId() == pageId) {
      this.#currentPage.knockKnock();
      return;
    }
    if (this.#currentPage) {
      this.#currentPage.clearStackFrom(1);
      this.#currentPage.detachRender();
      this.#currentPage.setActive(false);
      this.#currentPage = null;
    }
    if (!this.#mPageConfig.has(pageId)) {
      // Hack fix for initial case that even page for defaultPageId doesn't
      // exist
      return;
    }
    let page = this.#getOrInitPage(pageId);
    if (page) {
      // Clear theme set by page
      WebConfig.setThemeId(null);
      page.setOwner(this);
      this.#currentPage = page;
      this.#currentPage.setActive(true);
      this.#currentPage.attachRender(this.getRender());
      this.#currentPage.render();
    }
    this.#updateNavView();
    Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, "tab");
    this._delegate.onPageSwitchedInPageViewController(this);
  }

  _getAllChildControllers() {
    let cs = [ this.#fNav ];
    cs.push(...this.#mPage.values());
    return cs;
  }

  _getVisibleChildControllers() {
    let cs = [ this.#fNav ];
    if (this.#currentPage) {
      cs.push(this.#currentPage);
    }
    return cs;
  }

  _renderOnRender(render) {
    if (this.#currentPage) {
      this.#currentPage.attachRender(render);
      this.#currentPage.render();
    }
    // TODO: Handle nav view with better design.
  }

  #isOverlayAllowed() {
    return this.#currentPage && this.#currentPage.getStackSize() == 1;
  }

  #getOrInitPage(pageId) {
    let page = this._dataSource.createPageForPageViewController(this, pageId);
    page.setOwner(this);
    this.#mPage.set(pageId, page);
    return page;
  }

  #resetPages(pageConfigs) {
    // TODO: Restore pageId with consideration of pages wrapped inside extras
    // page
    let currentId = this.getActivePageId();
    if (this.#currentPage) {
      this.#currentPage.detachRender();
      this.#currentPage.setActive(false);
      this.#currentPage = null;
    }
    this.#mPageConfig.clear();
    this.#mPage.clear();
    for (let c of pageConfigs) {
      this.#mPageConfig.set(c.ID, c);
    }

    this.#updateNavView();
    this.switchToPage(this.#mPageConfig.has(currentId) ? currentId
                                                       : this.#defaultPageId);
  }

  #updateNavView() {
    this._delegate.onPageViewControllerWillUpdateNavView(this);
    this.#fNav.render();
    this._delegate.onPageViewControllerOverlayPermissionChange(
        this, this.#isOverlayAllowed());
  }
};
