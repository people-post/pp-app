import { Fragment } from './Fragment.js';
import { FTabbedPaneTabBar } from './FTabbedPaneTabBar.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

interface TabInfo {
  name: string;
  value: string;
  icon?: string;
}

export class FTabbedPane extends Fragment {
  #fBar: FTabbedPaneTabBar;
  #paneMap: Map<string, Fragment> = new Map();
  #paneId: string = "current";

  constructor() {
    super();
    this.#fBar = new FTabbedPaneTabBar();
    this.#fBar.setDataSource(this);
    this.#fBar.setDelegate(this);
    this.setChild("tabs", this.#fBar);
  }

  getTabValues(): string[] { return Array.from(this.#paneMap.keys()); }
  getNTabNoticesForTabbedPaneTabBarFragment(_fTab: FTabbedPaneTabBar, _v: string): number { return 0; }

  onTabSelectionChangedInTabbedPaneTabBarFragment(_fTab: FTabbedPaneTabBar, value: string): void {
    this.#switchTo(value);
  }
  onTabbedPaneTabBarFragmentRequestAddTab(_fTab: FTabbedPaneTabBar): void {
    if (this._delegate && typeof (this._delegate as any).onTabbedPaneFragmentRequestAddPane === 'function') {
      (this._delegate as any).onTabbedPaneFragmentRequestAddPane(this);
    }
  }
  onTabbedPaneTabBarFragmentRequestCloseTab(_fTab: FTabbedPaneTabBar, value: string): void {
    let permit = true;
    if (this._delegate && typeof (this._delegate as any).onTabbedPaneFragmentRequestClosePane === 'function') {
      permit = (this._delegate as any).onTabbedPaneFragmentRequestClosePane(this, value);
    }
    if (permit) {
      this.popPane(value);
    }
  }

  setDefaultPane(value: string): void { this.#switchTo(value); }

  setEnableEdit(b: boolean): void { this.#fBar.setEnableEdit(b); }
  setMaxNTabs(n: number): void { this.#fBar.setMaxNTabs(n); }
  setPane(value: string): void {
    let c = this.#fBar.getCurrentTab();
    if (c && c.value == value) {
      return;
    }
    this.#switchTo(value);
  }

  addPane(tabInfo: TabInfo, fContent: Fragment): void {
    this.#paneMap.set(tabInfo.value, fContent);
    this.#fBar.addTab(tabInfo);
    this.render();
  }

  popPane(value: string): void {
    this.#fBar.popTab(value);
    this.#paneMap.delete(value);
    this.render();
  }

  _renderOnRender(render: any): void {
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

  #switchTo(value: string): void {
    this.#fBar.setTab(value);
    let f = this.#paneMap.get(value);
    if (f) {
      this.setChild(this.#paneId, f);
    }
    this.render();
  }
}

