import { Fragment } from './Fragment.js';
import { FFragmentList } from './FFragmentList.js';
import { FTabbedPaneTab } from './FTabbedPaneTab.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { ICONS } from '../../Icons.js';
import { T_DATA } from '../../../framework/Events.js';

export class FTabbedPaneTabBar extends Fragment {
  #configs = [];
  #currentIdx = null;
  #enableEdit = false;
  #nMax = 0; // Currently only for editor mode
  #idxNew = -1;
  #shouldOnlyShowOnMulitple = false;
  #fTabs;

  constructor() {
    super();
    this.#fTabs = new FFragmentList();
    this.setChild("tabs", this.#fTabs);
  }

  getCurrentTab() { return this.#configs[this.#currentIdx]; }

  setEnableEdit(b) { this.#enableEdit = b; }
  setOnlyShowOnMultiple(b) { this.#shouldOnlyShowOnMulitple = b; }
  setMaxNTabs(n) { this.#nMax = n; }

  setTab(value) {
    let i = this.#getIndexByValue(value);
    if (i >= 0) {
      this.#currentIdx = i;
    }
  }

  isTabbedPaneTabFragmentSelected(fTab, tabId) {
    return tabId == this.#currentIdx;
  }
  isCloseBtnEnabledInTabbedPaneTabFragment(fTab, tabId) {
    return this.#enableEdit && tabId == this.#currentIdx;
  }
  getTabConfigForTabbedPaneTabFragment(fTab, tabId) {
    return this.#getTabConfig(tabId);
  }
  getNNoticesForTabbedPaneTabFragment(fTab, tabId) {
    let idx = tabId;
    if (this._dataSource) {
      let c = this.#configs[idx];
      if (c) {
        return this._dataSource.getNTabNoticesForTabbedPaneTabBarFragment(
            this, c.value);
      }
    }
    return 0;
  }

  onTabbedPaneTabFragmentClick(fTab, tabId) { this.#onClick(tabId); }
  onTabbedPaneTabFragmentRequestClose(fTab, tabId) {
    let idx = tabId;
    let c = this.#configs[idx];
    this._delegate.onTabbedPaneTabBarFragmentRequestCloseTab(this, c.value);
  }

  addTab(tabInfo) {
    // tabInfo: {name: "", value: "", icon: ""}
    let i = this.#getIndexByValue(tabInfo.value);
    if (i >= 0) {
      // Existing tab
      this.#configs[i] = tabInfo;
    } else {
      this.#configs.push(tabInfo);
    }
  }

  popTab(value) {
    let i = this.#getIndexByValue(value);
    if (i >= 0) {
      this.#configs.splice(i, 1);
    }
  }

  clearTabs() {
    this.#configs = [];
    this.#currentIdx = null;
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render) {
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

  #getTabConfig(idx) {
    if (idx == this.#idxNew) {
      return { name: "New", value: "__NEW", icon: ICONS.NEW }
    } else {
      return this.#configs[idx];
    }
  }

  #getIndexByValue(value) {
    for (let [i, v] of this.#configs.entries()) {
      if (v.value == value) {
        return i;
      }
    }
    return -1;
  }

  #onClick(idx) {
    if (idx == this.#idxNew) {
      this._delegate.onTabbedPaneTabBarFragmentRequestAddTab(this);
    } else if (this.#currentIdx != idx) {
      this.#currentIdx = idx;
      this._delegate.onTabSelectionChangedInTabbedPaneTabBarFragment(
          this, this.#configs[idx].value);
      this.render();
    }
  }
};
