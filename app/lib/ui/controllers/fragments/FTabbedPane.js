(function(ui) {
class FTabbedPane extends ui.Fragment {
  #fBar;
  #paneMap = new Map();
  #paneId = "current";

  constructor() {
    super();
    this.#fBar = new ui.FTabbedPaneTabBar();
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
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this.#fBar.attachRender(pp);
    this.#fBar.render();

    pp = new ui.PanelWrapper();
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

ui.FTabbedPane = FTabbedPane;
}(window.ui = window.ui || {}));
