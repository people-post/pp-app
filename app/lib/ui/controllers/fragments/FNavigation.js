import { Fragment } from './Fragment.js';
import { FSimpleFragmentList } from './FSimpleFragmentList.js';
import { FTabbedPaneTab } from './FTabbedPaneTab.js';

export const CF_NAVIGATION = {
  ON_TAB_CLICK : Symbol(),
};

// Export to window for string template access
if (typeof window !== 'undefined') {
  window.CF_NAVIGATION = CF_NAVIGATION;
}

export class FNavigation extends Fragment {
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

  action(type, ...args) {
    switch (type) {
    case CF_NAVIGATION.ON_TAB_CLICK:
      this.#onNavClick(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  isTabbedPaneTabFragmentSelected(fTab, tabId) {
    return tabId ==
           this._dataSource.getActiveNavItemIdForNavigationFragment(this);
  }
  isCloseBtnEnabledInTabbedPaneTabFragment(fTab, tabId) { return false; }
  getTabConfigForTabbedPaneTabFragment(fTab, tabId) {
    let item = this.#getItem(tabId);
    return { icon: item.ICON, name: item.name }
  }
  getNNoticesForTabbedPaneTabFragment(fTab, tabId) {
    let item = this.#getItem(tabId);
    return item ? item.NNOTIFICATIONS : 0;
  }

  onTabbedPaneTabFragmentClick(fTab, tabId) { this.#onNavClick(tabId); }
  onTabbedPaneTabFragmentRequestClose(fTab, tabId) {}

  _renderOnRender(render) {
    let items = this._dataSource.getNavItemsForNavigationFragment(this);

    let p = render.getTabPanel();
    if (p) {
      // Clear first since panel may be reused
      p.clear();
      this._fTabs.clear();
      if (!p.isLoginRequired() || dba.Account.isAuthenticated()) {
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
    render.clearNavPanels();

    let openAddons = items.filter(i => i.IS_OPEN_ADDON);
    for (let [i, item] of openAddons.entries()) {
      p = render.getNavPanel(i);
      let f = this._fNavTabs[i];
      if (p && f) {
        f.setTabId(item.ID);
        f.attachRender(p);
        f.render();
      }
    }
  }

  #getItem(itemId) {
    let items = this._dataSource.getNavItemsForNavigationFragment(this);
    return items.find(i => i.ID == itemId);
  }

  #onNavClick(pageId) {
    if (this._delegate) {
      this._delegate.onNavPageSelectedInNavigationFragment(this, pageId);
    }
  }
};

