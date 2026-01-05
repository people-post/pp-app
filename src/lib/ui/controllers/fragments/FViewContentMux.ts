import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { FViewContentContainer } from './FViewContentContainer.js';
import { FTabbedPaneTabBar } from './FTabbedPaneTabBar.js';
import { ScrollEndEventShim } from '../../../ext/ScrollEndEventShim.js';
import { FScrollViewContent } from './FScrollViewContent.js';
import { FScrollViewContentHook } from './FScrollViewContentHook.js';
import { FViewContentBase } from './FViewContentBase.js';

const _CPT_VIEW_CONTENT_MUX = {
  MAIN : `<div id="__ID_HEADER__" class="flex-noshrink"></div>
  <div id="__ID_CONTENT__" class="flex-grow y-no-overflow x-scroll x-scroll-snap flex"></div>`,
} as const;

class PViewContentMux extends Panel {
  #pHeader: PanelWrapper;
  #pContent: ListPanel;

  constructor() {
    super();
    this.#pHeader = new PanelWrapper();
    this.#pContent = new ListPanel();
  }

  getHeaderPanel(): PanelWrapper { return this.#pHeader; }
  getContentPanel(): ListPanel { return this.#pContent; }

  _renderFramework(): string {
    let s: string = _CPT_VIEW_CONTENT_MUX.MAIN;
    s = s.replace("__ID_HEADER__", this._getSubElementId("H"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pHeader.attach(this._getSubElementId("H"));
    this.#pContent.attach(this._getSubElementId("C"));
  }
}

interface TabConfig {
  value: string;
  name: string;
  icon?: string;
}

export class FViewContentMux extends FViewContentContainer {
  #fTabBar: FTabbedPaneTabBar;
  #fCurrent: FViewContentBase | null = null;
  #pContent: ListPanel | null = null;
  #obScrollEnd: ScrollEndEventShim;
  #mChildren: Map<string, FViewContentBase> = new Map();
  #obResize: ResizeObserver;

  constructor() {
    super();
    this.#fTabBar = new FTabbedPaneTabBar();
    this.#fTabBar.setOnlyShowOnMultiple(true);
    this.#fTabBar.setDataSource(this as any);
    this.#fTabBar.setDelegate(this as any);
    this.setChild("muxHeader", this.#fTabBar);

    this.#obScrollEnd = new ScrollEndEventShim();
    this.#obScrollEnd.setDelegate(this as any);

    this.#obResize = new ResizeObserver(() => this.#onResize());
  }

  getNTabNoticesForTabbedPaneTabBarFragment(_fTab: FTabbedPaneTabBar, v: string): number {
    if (this._dataSource && typeof (this._dataSource as any).getNTabNoticesForViewContentMuxFragment === 'function') {
      return (this._dataSource as any).getNTabNoticesForViewContentMuxFragment(this, v);
    }
    return 0;
  }

  onScrollEndInScrollEndEventShim(_sScrollEnd: ScrollEndEventShim): void { this.#onScrollEnd(); }

  onTabSelectionChangedInTabbedPaneTabBarFragment(_fTab: FTabbedPaneTabBar, v: string): void {
    this.#switchContentTo(v);
  }

  addTab(tabConfig: TabConfig, fTab: FViewContentBase): void {
    this.#fTabBar.addTab(tabConfig);
    let f: FViewContentBase = fTab;
    if (fTab instanceof FScrollViewContent) {
      // Wrap scroll content with scroll hook
      f = new FScrollViewContentHook(fTab);
    }
    this.#mChildren.set(tabConfig.value, f);
    this.setChild(tabConfig.value, f);
  }

  clearContents(): void {
    this.#fTabBar.clearTabs();
    for (let id of this.#mChildren.keys()) {
      this.setChild(id, null);
    }
    this.#mChildren.clear();
  }

  switchTo(id: string): void {
    this.#fTabBar.setTab(id);
    this.#switchContentTo(id);
  }

  _getContentFragment(): FViewContentBase | null { return this.#fCurrent; }

  _renderOnRender(render: any): void {
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
    if (e) {
      this.#obScrollEnd.observe(e);
      this.#obResize.observe(e);
    }
  }

  #switchContentTo(id: string): void {
    let f = this.#mChildren.get(id);
    if (this.#fCurrent == f) {
      return;
    }
    this.#fCurrent = f ?? null;
    this.#scrollToCurrentContent();
  }

  #scrollToCurrentContent(): void {
    if (!this.#fCurrent) {
      return;
    }

    let r = this.#fCurrent.getRender();
    if (r && (r as any).getVisibleWidthInParent() > 10) {
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

  #onScrollEnd(): void { this.#updateTabBar(); }

  #updateTabBar(): void {
    if (!this.#pContent) return;
    let xObj = this.#pContent.getScrollX();
    if (!xObj) return;
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

  #isPanelInXRange(panel: any, xOffset: number, width: number): boolean {
    if (!panel) {
      return false;
    }
    let x = panel.getLeft();
    let w = panel.getWidth();
    return x >= xOffset && ((x + w) / 2 < xOffset + width);
  }

  #onResize(): void { this.#scrollToCurrentContent(); }
}

