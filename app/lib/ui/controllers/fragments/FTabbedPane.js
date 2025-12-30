import { Fragment } from './Fragment.js';
import { FTabbedPaneTabBar } from './FTabbedPaneTabBar.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

export class FTabbedPane extends Fragment {
  #fBar;
  #paneMap = new Map();
  #paneId = "current";

  constructor() {
    super();
    this.#fBar = new FTabbedPaneTabBar();
    this.#fBar.setDataSource(this);
    this.#fBar.setDelegate(this);
    this.setChild("tabs", this.#fBar);
  }

  getTabValues() { return Array.from(this.#paneMap.keys()); }
  getNTabNoticesForTabbedPaneTabBarFragment(fTab, v) { return 0; }

  onTabSelectionChangedInTabbedPaneTabBarFragment(fTab, value) {
    this.#switchTo(value);
  }
  onTabbedPaneTabBarFragmentRequestAddTab(fTab) {
    if (this._delegate) {
      this._delegate.onTabbedPaneFragmentRequestAddPane(this);
    }
  }
  onTabbedPaneTabBarFragmentRequestCloseTab(fTab, value) {
    let permit = true;
    if (this._delegate) {
      permit = this._delegate.onTabbedPaneFragmentRequestClosePane(this, value);
    }
    if (permit) {
      this.popPane(value);
    }
  }

  setDefaultPane(value) { this.#switchTo(value); }

  setEnableEdit(b) { this.#fBar.setEnableEdit(b); }
  setMaxNTabs(n) { this.#fBar.setMaxNTabs(n); }
  setPane(value) {
    let c = this.#fBar.getCurrentTab();
    if (c && c.value == value) {
      return;
    }
    this.#switchTo(value);
  }

  addPane(tabInfo, fContent) {
    this.#paneMap.set(tabInfo.value, fContent);
    this.#fBar.addTab(tabInfo);
    this.render();
  }

  popPane(value) {
    this.#fBar.popTab(value);
    this.#paneMap.delete(value);
    this.render();
  }

  _renderOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this.#fBar.attachRender(pp);
    this.#fBar.render();

    pp = new PanelWrapper();
    p.pushPanel(pp);
    let f = this._getChild(this.#paneId);
    if (f) {
      f.attachRender(pp);
      f.render();
    }
  }

  #switchTo(value) {
    this.#fBar.setTab(value);
    let f = this.#paneMap.get(value);
    if (f) {
      this.setChild(this.#paneId, f);
    }
    this.render();
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.FTabbedPane = FTabbedPane;
}
