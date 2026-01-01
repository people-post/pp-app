import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { FViewContentContainer } from './FViewContentContainer.js';
import { FTabbedPaneTabBar } from './FTabbedPaneTabBar.js';
import { ScrollEndEventShim } from '../../../ext/ScrollEndEventShim.js';
import { FScrollViewContent } from './FScrollViewContent.js';
import { FScrollViewContentHook } from './FScrollViewContentHook.js';

const _CPT_VIEW_CONTENT_MUX = {
  MAIN : `<div id="__ID_HEADER__" class="flex-noshrink"></div>
  <div id="__ID_CONTENT__" class="flex-grow y-no-overflow x-scroll x-scroll-snap flex"></div>`,
};

class PViewContentMux extends Panel {
  #pHeader;
  #pContent;

  constructor() {
    super();
    this.#pHeader = new PanelWrapper();
    this.#pContent = new ListPanel();
  }

  getHeaderPanel() { return this.#pHeader; }
  getContentPanel() { return this.#pContent; }

  _renderFramework() {
    let s = _CPT_VIEW_CONTENT_MUX.MAIN;
    s = s.replace("__ID_HEADER__", this._getSubElementId("H"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pHeader.attach(this._getSubElementId("H"));
    this.#pContent.attach(this._getSubElementId("C"));
  }
};

export class FViewContentMux extends FViewContentContainer {
  #fTabBar;
  #fCurrent = null;
  #pContent = null;
  #obScrollEnd;
  #mChildren = new Map();
  #obResize;

  constructor() {
    super();
    this.#fTabBar = new FTabbedPaneTabBar();
    this.#fTabBar.setOnlyShowOnMultiple(true);
    this.#fTabBar.setDataSource(this);
    this.#fTabBar.setDelegate(this);
    this.setChild("muxHeader", this.#fTabBar);

    this.#obScrollEnd = new ScrollEndEventShim();
    this.#obScrollEnd.setDelegate(this);

    this.#obResize = new ResizeObserver(() => this.#onResize());
  }

  getNTabNoticesForTabbedPaneTabBarFragment(fTab, v) {
    if (this._dataSource) {
      return this._dataSource.getNTabNoticesForViewContentMuxFragment(this, v);
    }
    return 0;
  }

  onScrollEndInScrollEndEventShim(sScrollEnd) { this.#onScrollEnd(); }

  onTabSelectionChangedInTabbedPaneTabBarFragment(fTab, v) {
    this.#switchContentTo(v);
  }

  addTab(tabConfig, fTab) {
    this.#fTabBar.addTab(tabConfig);
    let f = fTab;
    if (fTab instanceof FScrollViewContent) {
      // Wrap scroll content with scroll hook
      f = new FScrollViewContentHook(fTab);
    }
    this.#mChildren.set(tabConfig.value, f);
    this.setChild(tabConfig.value, f);
  }

  clearContents() {
    this.#fTabBar.clearTabs();
    for (let id of this.#mChildren.keys()) {
      this.setChild(id, null);
    }
    this.#mChildren.clear();
  }

  switchTo(id) {
    this.#fTabBar.setTab(id);
    this.#switchContentTo(id);
  }

  _getContentFragment() { return this.#fCurrent; }

  _renderOnRender(render) {
    let panel = new PViewContentMux();
    panel.setClassName("h100 flex flex-column");
    render.wrapPanel(panel);

    this.#obResize.disconnect();

    let p = panel.getHeaderPanel();
    this.#fTabBar.attachRender(p);
    this.#fTabBar.render();

    this.#pContent = panel.getContentPanel();
    for (let f of this.#mChildren.values()) {
      p = new PanelWrapper();
      p.setClassName("h100 w100 scroll-snap-start flex-noshrink");
      this.#pContent.pushPanel(p);
      f.attachRender(p);
      f.render();
    }
    this.#scrollToCurrentContent();

    let e = this.#pContent.getDomElement();
    this.#obScrollEnd.observe(e);
    this.#obResize.observe(e);
  }

  #switchContentTo(id) {
    let f = this.#mChildren.get(id);
    if (this.#fCurrent == f) {
      return;
    }
    this.#fCurrent = f;
    this.#scrollToCurrentContent();
  }

  #scrollToCurrentContent() {
    if (!this.#fCurrent) {
      return;
    }

    let r = this.#fCurrent.getRender();
    if (r && r.getVisibleWidthInParent() > 10) {
      // Already in Viewport, no need to scroll
      return;
    }

    if (!this.#pContent) {
      return;
    }

    let x = 0;
    for (let f of this.#mChildren.values()) {
      if (f == this.#fCurrent) {
        break;
      } else {
        r = f.getRender();
        if (r) {
          x += r.getWidth();
        }
      }
    }
    this.#pContent.scrollTo(x, 0, "smooth");
    this.#fCurrent.render();
    this.onContentFragmentRequestUpdateHeader(this);
  }

  #onScrollEnd() { this.#updateTabBar(); }

  #updateTabBar() {
    let xObj = this.#pContent.getScrollX();
    let w = this.#pContent.getWidth();

    for (let [id, f] of this.#mChildren.entries()) {
      let p = f.getRender();
      if (this.#isPanelInXRange(p, xObj.value, w)) {
        if (this.#fCurrent != f) {
          this.#fTabBar.setTab(id);
          this.#fTabBar.render();
          this.#fCurrent = f;
          this.#fCurrent.render();
          this.onContentFragmentRequestUpdateHeader(this);
        }
        break;
      }
    }
  }

  #isPanelInXRange(panel, xOffset, width) {
    if (!panel) {
      return false;
    }
    let x = panel.getLeft();
    let w = panel.getWidth();
    return x >= xOffset && ((x + w) / 2 < xOffset + width);
  }

  #onResize() { this.#scrollToCurrentContent(); }
};
