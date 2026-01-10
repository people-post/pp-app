import { RenderController } from './RenderController.js';
import { FNavigation } from './fragments/FNavigation.js';
import { Page } from './Page.js';
import { T_DATA, T_ACTION, Events } from '../../framework/Events.js';
import { WebConfig } from '../../../common/dba/WebConfig.js';
import { ViewStack, ViewStackOwner } from './ViewStack.js';
import { View } from './views/View.js';
import { PageConfig } from '../../../common/plt/SectorGateway.js';
import { ConsolePanel } from '../renders/panels/ConsolePanel.js';

export interface PageViewControllerOwner {
  onPageViewControllerRequestPopView(pvc: PageViewController): void;
}

export interface PageViewControllerDataSource {
  isPageNavPageInPageViewController(pvc: PageViewController, pageId: string): boolean;
  getNPageNotificationsForPageViewController(pvc: PageViewController, pageId: string): number;
  createPageForPageViewController(pvc: PageViewController, pageId: string): Page;
}

export interface PageViewControllerDelegate {
  onPageViewControllerOverlayPermissionChange(pvc: PageViewController, allowed: boolean): void;
  onPageViewControllerWillUpdateNavView(pvc: PageViewController): void;
  onPageSwitchedInPageViewController(pvc: PageViewController): void;
}

export class PageViewController extends RenderController implements ViewStackOwner {
  #mPageConfig: Map<string, PageConfig>;
  #mPage: Map<string, Page>;
  #currentPage: Page | null = null;
  #defaultPageId: string | null = null;
  #fNav: FNavigation;

  protected declare _dataSource: PageViewControllerDataSource;
  protected declare _delegate: PageViewControllerDelegate;

  constructor() {
    super();
    this.#mPageConfig = new Map(); // All pages with visible tab
    this.#mPage = new Map();       // All pages with visible tab

    this.#fNav = new FNavigation();
    this.#fNav.setDataSource(this);
    this.#fNav.setDelegate(this);
  }

  init(configs?: PageConfig[]): void {
    super.init();
    if (configs) {
      this.#resetPages(configs);
      // This is a hack fix for ViewStack that initially it doesn't show
      // action button correctly in multi frame layout
      this.onResize();
    }
  }

  initFromUrl(urlParam: URLSearchParams): void {
    if (this.#currentPage) {
      this.#currentPage.initFromUrl(urlParam);
    }
  }

  getActiveNavItemIdForNavigationFragment(_fNav: FNavigation): string | null {
    return this.getActivePageId();
  }
  getNavItemsForNavigationFragment(_fNav: FNavigation): any[] {
    let items: any[] = [];
    const dataSource = this.getDataSource<PageViewControllerDataSource>();
    for (let c of this.#mPageConfig.values()) {
      items.push({
        ID : c.ID,
        ICON : c.ICON,
        NNOTIFICATIONS :
            dataSource?.getNPageNotificationsForPageViewController(this,
                                                                        c.ID),
        IS_OPEN_ADDON :
            dataSource?.isPageNavPageInPageViewController(this, c.ID),
      });
    }
    return items;
  }

  getUrlParamString(): string {
    return this.#currentPage ? this.#currentPage.getUrlParamString() : "";
  }
  getActivePageId(): string | null {
    return this.#currentPage ? this.#currentPage.getPageId() : null;
  }

  setDefaultPageId(id: string | null): void { this.#defaultPageId = id; }

  onViewStackStackSizeChange(_nc: ViewStack): void {
    const delegate = this.getDelegate<PageViewControllerDelegate>();
    if (delegate) {
      delegate.onPageViewControllerOverlayPermissionChange(
        this, this.#isOverlayAllowed());
    }
  }

  onNavPageSelectedInNavigationFragment(_fNav: FNavigation, pageId: string): void {
    this.switchToPage(pageId);
  }

  onViewStackRequestPopView(nc: ViewStack): void {
    if (nc == this.#currentPage) {
      const owner = this.getOwner<PageViewControllerOwner>();
      if (owner) {
        owner.onPageViewControllerRequestPopView(this);
      }
    }
  }

  onResize(): void {
    if (this.#currentPage) {
      this.#currentPage.onResize();
    }
  }

  replaceNavWrapperPanel(panel: ConsolePanel): void {
    this.attachExtraRender("nav", panel);
    this.#fNav.attachRender(panel);
    this.#updateNavView();
  }

  pushView(view: View, title: string): void {
    if (this.#currentPage) {
      this.#currentPage.pushView(view, title);
    }
  }

  popState(state: any): void {
    if (this.#currentPage) {
      this.#currentPage.popState(state);
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
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
    super.handleSessionDataUpdate(dataType, data);
  }

  switchToDefaultPage(): void { this.switchToPage(this.#defaultPageId); }
  switchToPage(rawPageId: string | null): void {
    let pageId: string | null = rawPageId;
    if (!pageId || !this.#mPageConfig.has(pageId)) {
      pageId = this.#defaultPageId;
      // Even default may not exist
      if (!pageId || !this.#mPageConfig.has(pageId)) {
        let firstKey = this.#mPageConfig.keys().next().value;
        pageId = firstKey || null;
        // Notice pageId can still not exist, will be handled later.
      }
    }
    if (this.#currentPage && this.getActivePageId() == pageId) {
      this.#currentPage.knockKnock();
      return;
    }
    if (this.#currentPage) {
      (this.#currentPage as any).clearStackFrom(1);
      this.#currentPage.detachRender();
      this.#currentPage.setActive(false);
      this.#currentPage = null;
    }
    if (!pageId || !this.#mPageConfig.has(pageId)) {
      // Hack fix for initial case that even page for defaultPageId doesn't
      // exist
      return;
    }
    let page = this.#getOrInitPage(pageId);
    if (page) {
      // Clear theme set by page
      WebConfig.setThemeId(null);
      page.setOwner(this as unknown as RenderController);
      this.#currentPage = page;
      this.#currentPage.setActive(true);
      let r = this.getRender();
      if (r) {
        this.#currentPage.attachRender(r);
        this.#currentPage.render();
      }
    }
    this.#updateNavView();
    Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, "tab");
    const delegate = this.getDelegate<PageViewControllerDelegate>();
    if (delegate) {
      delegate.onPageSwitchedInPageViewController(this);
    }
  }

  _getAllChildControllers(): any[] {
    let cs: any[] = [ this.#fNav ];
    cs.push(...this.#mPage.values());
    return cs;
  }

  _getVisibleChildControllers(): any[] {
    let cs: any[] = [ this.#fNav ];
    if (this.#currentPage) {
      cs.push(this.#currentPage);
    }
    return cs;
  }

  _renderOnRender(render: any): void {
    if (this.#currentPage) {
      this.#currentPage.attachRender(render);
      this.#currentPage.render();
    }
    // TODO: Handle nav view with better design.
  }

  #isOverlayAllowed(): boolean {
    return this.#currentPage ? this.#currentPage.getStackSize() == 1 : false;
  }

  #getOrInitPage(pageId: string): Page {
    const dataSource = this.getDataSource<PageViewControllerDataSource>();
    if (!dataSource) {
      console.error("DataSource is not set in PageViewController");
      throw new Error("DataSource is not set");
    }
    let page = dataSource.createPageForPageViewController(this, pageId);
    page.setOwner(this);
    this.#mPage.set(pageId, page);
    return page;
  }

  #resetPages(pageConfigs: PageConfig[]): void {
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
    this.switchToPage(this.#mPageConfig.has(currentId || "") ? currentId
                                                       : this.#defaultPageId);
  }

  #updateNavView(): void {
    const delegate = this.getDelegate<PageViewControllerDelegate>();
    if (delegate) {
      delegate.onPageViewControllerWillUpdateNavView(this);
    }
    this.#fNav.render();
    if (delegate) {
      delegate.onPageViewControllerOverlayPermissionChange(
        this, this.#isOverlayAllowed());
    }
  }
}

