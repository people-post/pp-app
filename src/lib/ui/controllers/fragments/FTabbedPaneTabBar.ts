import { Fragment } from './Fragment.js';
import { FFragmentList } from './FFragmentList.js';
import { FTabbedPaneTab } from './FTabbedPaneTab.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { ICONS } from '../../Icons.js';
import { T_DATA } from '../../../framework/Events.js';

interface TabInfo {
  name: string;
  value: string;
  icon?: string;
}

export class FTabbedPaneTabBar extends Fragment {
  #configs: TabInfo[] = [];
  #currentIdx: number | null = null;
  #enableEdit: boolean = false;
  #nMax: number = 0; // Currently only for editor mode
  #idxNew: number = -1;
  #shouldOnlyShowOnMulitple: boolean = false;
  #fTabs: FFragmentList;

  constructor() {
    super();
    this.#fTabs = new FFragmentList();
    this.setChild("tabs", this.#fTabs);
  }

  getCurrentTab(): TabInfo | undefined { return this.#configs[this.#currentIdx ?? -1]; }

  setEnableEdit(b: boolean): void { this.#enableEdit = b; }
  setOnlyShowOnMultiple(b: boolean): void { this.#shouldOnlyShowOnMulitple = b; }
  setMaxNTabs(n: number): void { this.#nMax = n; }

  setTab(value: string): void {
    let i = this.#getIndexByValue(value);
    if (i >= 0) {
      this.#currentIdx = i;
    }
  }

  isTabbedPaneTabFragmentSelected(_fTab: FTabbedPaneTab, tabId: number): boolean {
    return tabId == this.#currentIdx;
  }
  isCloseBtnEnabledInTabbedPaneTabFragment(_fTab: FTabbedPaneTab, tabId: number): boolean {
    return this.#enableEdit && tabId == this.#currentIdx;
  }
  getTabConfigForTabbedPaneTabFragment(_fTab: FTabbedPaneTab, tabId: number): TabInfo {
    return this.#getTabConfig(tabId);
  }
  getNNoticesForTabbedPaneTabFragment(_fTab: FTabbedPaneTab, tabId: number): number {
    let idx = tabId;
    if (this._dataSource) {
      let c = this.#configs[idx];
      if (c && typeof (this._dataSource as any).getNTabNoticesForTabbedPaneTabBarFragment === 'function') {
        return (this._dataSource as any).getNTabNoticesForTabbedPaneTabBarFragment(
            this, c.value);
      }
    }
    return 0;
  }

  onTabbedPaneTabFragmentClick(_fTab: FTabbedPaneTab, tabId: number): void { this.#onClick(tabId); }
  onTabbedPaneTabFragmentRequestClose(_fTab: FTabbedPaneTab, tabId: number): void {
    let idx = tabId;
    let c = this.#configs[idx];
    if (c && this._delegate && typeof (this._delegate as any).onTabbedPaneTabBarFragmentRequestCloseTab === 'function') {
      (this._delegate as any).onTabbedPaneTabBarFragmentRequestCloseTab(this, c.value);
    }
  }

  addTab(tabInfo: TabInfo): void {
    // tabInfo: {name: "", value: "", icon: ""}
    let i = this.#getIndexByValue(tabInfo.value);
    if (i >= 0) {
      // Existing tab
      this.#configs[i] = tabInfo;
    } else {
      this.#configs.push(tabInfo);
    }
  }

  popTab(value: string): void {
    let i = this.#getIndexByValue(value);
    if (i >= 0) {
      this.#configs.splice(i, 1);
    }
  }

  clearTabs(): void {
    this.#configs = [];
    this.#currentIdx = null;
  }

  handleSessionDataUpdate(dataType: symbol | string, data?: any): void {
    switch (dataType) {
    case T_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: any): void {
    if (this.#shouldOnlyShowOnMulitple && !this.#enableEdit &&
        this.#configs.length < 2) {
      return;
    }
    let panel = new ListPanel();
    panel.setClassName(
        "bd-b-1px bd-b-solid bdlightgrey flex flex-start center-align-items x-scroll no-scrollbar no-wrap");
    render.wrapPanel(panel);

    // Allow events
    this.#fTabs.attachRender(panel);

    this.#fTabs.clear();
    for (let i = 0; i < this.#configs.length; ++i) {
      let f = new FTabbedPaneTab();
      f.setTabId(i);
      f.setDataSource(this);
      f.setDelegate(this);
      this.#fTabs.append(f);
    }

    if (this.#enableEdit &&
        (this.#nMax == 0 || this.#configs.length < this.#nMax)) {
      let f = new FTabbedPaneTab();
      f.setTabId(this.#idxNew);
      f.setDataSource(this);
      f.setDelegate(this);
      this.#fTabs.append(f);
    }

    for (let f of this.#fTabs.getChildren()) {
      let p = new PanelWrapper();
      panel.pushPanel(p);
      f.attachRender(p);
      f.render();
    }
  }

  #getTabConfig(idx: number): TabInfo {
    if (idx == this.#idxNew) {
      return { name: "New", value: "__NEW", icon: ICONS.NEW }
    } else {
      return this.#configs[idx];
    }
  }

  #getIndexByValue(value: string): number {
    for (let [i, v] of this.#configs.entries()) {
      if (v.value == value) {
        return i;
      }
    }
    return -1;
  }

  #onClick(idx: number): void {
    if (idx == this.#idxNew) {
      if (this._delegate && typeof (this._delegate as any).onTabbedPaneTabBarFragmentRequestAddTab === 'function') {
        (this._delegate as any).onTabbedPaneTabBarFragmentRequestAddTab(this);
      }
    } else if (this.#currentIdx != idx) {
      this.#currentIdx = idx;
      if (this._delegate && typeof (this._delegate as any).onTabSelectionChangedInTabbedPaneTabBarFragment === 'function') {
        (this._delegate as any).onTabSelectionChangedInTabbedPaneTabBarFragment(
            this, this.#configs[idx].value);
      }
      this.render();
    }
  }
}

