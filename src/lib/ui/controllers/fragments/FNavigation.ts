import { Fragment } from './Fragment.js';
import { FSimpleFragmentList } from './FSimpleFragmentList.js';
import { FTabbedPaneTab } from './FTabbedPaneTab.js';
import { Account } from '../../../../common/dba/Account.js';

export const CF_NAVIGATION = {
  ON_TAB_CLICK : Symbol(),
};

// Export to window for string template access
declare global {
  interface Window {
    CF_NAVIGATION?: typeof CF_NAVIGATION;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_NAVIGATION = CF_NAVIGATION;
}

interface NavItem {
  ID: string;
  name: string;
  ICON?: string;
  NNOTIFICATIONS?: number;
  IS_OPEN_ADDON?: boolean;
}

export class FNavigation extends Fragment {
  private _fTabs: FSimpleFragmentList;
  private _fNavTabs: FTabbedPaneTab[];

  constructor() {
    super();
    this._fTabs = new FSimpleFragmentList();
    this.setChild("tabs", this._fTabs);

    this._fNavTabs = [ new FTabbedPaneTab(), new FTabbedPaneTab() ];
    for (let [i, f] of this._fNavTabs.entries()) {
      f.setLayoutType(FTabbedPaneTab.T_LAYOUT.MIDDLE);
      f.setDataSource(this);
      f.setDelegate(this);
      this.setChild("navTabs" + i, f);
    }
  }

  action(type: symbol | string, ...args: any[]): void {
    switch (type) {
    case CF_NAVIGATION.ON_TAB_CLICK:
      this.#onNavClick(args[0]);
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  isTabbedPaneTabFragmentSelected(_fTab: FTabbedPaneTab, tabId: string): boolean {
    if (this._dataSource && typeof (this._dataSource as any).getActiveNavItemIdForNavigationFragment === 'function') {
      return tabId ==
             (this._dataSource as any).getActiveNavItemIdForNavigationFragment(this);
    }
    return false;
  }
  isCloseBtnEnabledInTabbedPaneTabFragment(_fTab: FTabbedPaneTab, _tabId: string): boolean { return false; }
  getTabConfigForTabbedPaneTabFragment(_fTab: FTabbedPaneTab, tabId: string): { icon?: string; name: string } {
    let item = this.#getItem(tabId);
    return { icon: item?.ICON, name: item?.name ?? "" }
  }
  getNNoticesForTabbedPaneTabFragment(_fTab: FTabbedPaneTab, tabId: string): number {
    let item = this.#getItem(tabId);
    return item ? (item.NNOTIFICATIONS ?? 0) : 0;
  }

  onTabbedPaneTabFragmentClick(_fTab: FTabbedPaneTab, tabId: string): void { this.#onNavClick(tabId); }
  onTabbedPaneTabFragmentRequestClose(_fTab: FTabbedPaneTab, _tabId: string): void {}

  _renderOnRender(render: any): void {
    let items: NavItem[] = [];
    if (this._dataSource && typeof (this._dataSource as any).getNavItemsForNavigationFragment === 'function') {
      items = (this._dataSource as any).getNavItemsForNavigationFragment(this);
    }

    let p = (render as any).getTabPanel();
    if (p) {
      // Clear first since panel may be reused
      p.clear();
      this._fTabs.clear();
      if (!(p as any).isLoginRequired() || Account.isAuthenticated()) {
        for (let item of items) {
          let f = new FTabbedPaneTab();
          f.setLayoutType(FTabbedPaneTab.T_LAYOUT.LARGE);
          f.setTabId(item.ID);
          f.setDelegate(this);
          f.setDataSource(this);
          this._fTabs.append(f);
        }
        this._fTabs.attachRender(p);
        this._fTabs.render();
      }
    }

    // Clear first since panel may be reused.
    if (typeof (render as any).clearNavPanels === 'function') {
      (render as any).clearNavPanels();
    }

    let openAddons = items.filter(i => i.IS_OPEN_ADDON);
    for (let [i, item] of openAddons.entries()) {
      p = (render as any).getNavPanel(i);
      let f = this._fNavTabs[i];
      if (p && f) {
        f.setTabId(item.ID);
        f.attachRender(p);
        f.render();
      }
    }
  }

  #getItem(itemId: string): NavItem | undefined {
    let items: NavItem[] = [];
    if (this._dataSource && typeof (this._dataSource as any).getNavItemsForNavigationFragment === 'function') {
      items = (this._dataSource as any).getNavItemsForNavigationFragment(this);
    }
    return items.find(i => i.ID == itemId);
  }

  #onNavClick(pageId: string): void {
    if (this._delegate && typeof (this._delegate as any).onNavPageSelectedInNavigationFragment === 'function') {
      (this._delegate as any).onNavPageSelectedInNavigationFragment(this, pageId);
    }
  }
}

