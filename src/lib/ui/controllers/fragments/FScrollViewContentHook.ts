import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { FViewContentWrapper } from './FViewContentWrapper.js';
import { ScrollEndEventShim } from '../../../ext/ScrollEndEventShim.js';
import { FElasticRefresh } from './FElasticRefresh.js';
import { Fragment } from './Fragment.js';
import { FViewContentBase } from './FViewContentBase.js';

const _CPT_SCROLL_VIEW_CONTENT_HOOK = {
  MAIN : `<div id="__ID_ELASTIC_REFRESH__" class="flex-noshrink"></div>
  <div id="__ID_CONTENT__" class="flex-grow y-no-overflow y-scroll no-scrollbar">
  </div>
  <div class="flex-noshrink relative">
    <span id="__ID_BSTT__" class="absolute left0px bottom72px left-side-button"></span>
  </div>`,
  CONTENT : `<div id="__ID_CONTENT__" class="hmin100"></div>
  <hr>
  <div class="s-font5 center-align">
    <div>Powered by <a href="https://gcabin.com" target="_blank">G-Cabin&#x1f517;</a> community.</div>
  <br>
  <br>`,
} as const;

class PScrollViewContentHook extends Panel {
  #pElasticRefresh: PanelWrapper;
  #pContentContainer: Panel;
  #pContent: PanelWrapper;
  #pBstt: Panel;

  constructor() {
    super();
    this.#pElasticRefresh = new PanelWrapper();
    this.#pContentContainer = new Panel();
    this.#pContent = new PanelWrapper();
    this.#pBstt = new Panel();
  }

  getElasticRefreshPanel(): PanelWrapper { return this.#pElasticRefresh; }
  getContentContainerPanel(): Panel { return this.#pContentContainer; }
  getContentPanel(): PanelWrapper { return this.#pContent; }
  getBsttPanel(): Panel { return this.#pBstt; }

  _renderFramework(): string {
    let s: string = _CPT_SCROLL_VIEW_CONTENT_HOOK.MAIN;
    s = s.replace("__ID_ELASTIC_REFRESH__", this._getSubElementId("R") as string);
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C") as string);
    s = s.replace("__ID_BSTT__", this._getSubElementId("B") as string);
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pElasticRefresh.attach(this._getSubElementId("R"));
    this.#pContentContainer.attach(this._getSubElementId("C"));
    this.#pBstt.attach(this._getSubElementId("B"));

    let s: string = _CPT_SCROLL_VIEW_CONTENT_HOOK.CONTENT;
    let id = this._getSubElementId("CC");
    s = s.replace("__ID_CONTENT__", id as string);
    this.#pContentContainer.replaceContent(s);
    this.#pContent.attach(id);
  }
}

export const CF_SCROLL_VIEW_CONTENT_HOOK = {
  SCROLL_TO_TOP : Symbol(),
} as const;

// Export to window for string template access
if (typeof window !== 'undefined') {
  (window as any).CF_SCROLL_VIEW_CONTENT_HOOK = CF_SCROLL_VIEW_CONTENT_HOOK;
}

interface ScrollYInfo {
  value: number;
  total: number;
}

export class FScrollViewContentHook extends FViewContentWrapper {
  #fElasticRefresh: FElasticRefresh;
  #sScrollEvt: ScrollEndEventShim;
  #pMain: PScrollViewContentHook | null = null;
  #scrollYBeforeTopResize: ScrollYInfo | null = null;

  constructor(fContent: FViewContentBase) {
    super();
    this.#sScrollEvt = new ScrollEndEventShim();
    this.#sScrollEvt.setDelegate(this);

    this.#fElasticRefresh = new FElasticRefresh();
    this.#fElasticRefresh.setDataSource(this);
    this.#fElasticRefresh.setDelegate(this);
    this.setChild("__elasticrefresh", this.#fElasticRefresh);
    this.wrapContentFragment(fContent);
  }

  shouldElasticRefreshFragmentEngage(_fElasticRefresh: FElasticRefresh): boolean {
    return this.#isReadyForPullToRefresh();
  }

  onScrollEndInScrollEndEventShim(_sScrollEnd: ScrollEndEventShim): void { this.#onScrollEnd(); }
  onElasticRefreshFragmentRequstRefresh(_fElasticRefresh: FElasticRefresh): void {
    let f = this._getContentFragment();
    if (f && typeof (f as any).reload === 'function') {
      (f as any).reload();
    }
  }

  onContentTopResizeBeginInFragment(_f: Fragment): void {
    this.#scrollYBeforeTopResize = this.#getScrollY();
  }
  onContentTopResizeEndInFragment(_f: Fragment): void {
    let yObj = this.#getScrollY();
    // Scroll to same height relative to end
    if (yObj && this.#scrollYBeforeTopResize) {
      let h = this.#scrollYBeforeTopResize.total -
              this.#scrollYBeforeTopResize.value;
      let y = yObj.total - h;
      this.#scrollTo(0, y);
    }
    this.#scrollYBeforeTopResize = null;
  }

  knockKnock(): void {
    super.knockKnock();
    this.#scrollToTop();
  }

  action(type: symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_SCROLL_VIEW_CONTENT_HOOK.SCROLL_TO_TOP:
      this.#scrollToTop();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderOnRender(render: any): void {
    let panel = new PScrollViewContentHook();
    panel.setClassName("h100 flex flex-column");
    render.wrapPanel(panel);
    this.#pMain = panel;

    const pElasticRefresh = panel.getElasticRefreshPanel();
    this.#fElasticRefresh.attachRender(pElasticRefresh);
    this.#fElasticRefresh.render();

    const pBstt = panel.getBsttPanel();
    pBstt.replaceContent("Back to top");
    pBstt.setVisible(false);
    pBstt.setAttribute(
        "onclick",
        "javascript:G.action(window.CF_SCROLL_VIEW_CONTENT_HOOK.SCROLL_TO_TOP)");

    const pContentContainer = panel.getContentContainerPanel();
    let e = pContentContainer.getDomElement();
    if (e) {
      this.#sScrollEvt.observe(e);
    }

    const pContent = panel.getContentPanel();
    let f = this._getContentFragment();
    if (f && typeof (f as any).isReloadable === 'function' && (f as any).isReloadable()) {
      let e = pContent.getDomElement();
      if (e) {
        this.#fElasticRefresh.observe(e);
      }
    }

    if (f) {
      f.attachRender(pContent);
      f.render();
    }
  }

  #isReadyForPullToRefresh(): boolean {
    let f = this._getContentFragment();
    if (f && typeof (f as any).hasHiddenTopBuffer === 'function' && (f as any).hasHiddenTopBuffer()) {
      return false;
    }
    let yObj = this.#getScrollY();
    if (yObj && yObj.value == 0) {
      return true;
    }
    return false;
  }

  #getScrollY(): ScrollYInfo | null {
    let p = this.#pMain ? this.#pMain.getContentContainerPanel() : null;
    if (p) {
      return p.getScrollY();
    }
    return null;
  }

  #onScrollEnd(): void {
    let pSttb = this.#pMain ? this.#pMain.getBsttPanel() : null;
    if (pSttb) {
      let yObj = this.#getScrollY();
      pSttb.setVisible(yObj ? yObj.value > 500 : false);
    }
    let f = this._getContentFragment();
    if (f && typeof (f as any).onScrollFinished === 'function') {
      (f as any).onScrollFinished();
    }
  }

  #scrollToTop(): void {
    let f = this._getContentFragment();
    if (f && typeof (f as any).scrollToTop === 'function') {
      (f as any).scrollToTop();
    }
    this.#scrollTo(0, 0);
    // Render is needed to avoid blank screen although not fully understand why
    this.render();
  }

  #scrollTo(x: number, y: number): void {
    let p = this.#pMain ? this.#pMain.getContentContainerPanel() : null;
    if (p) {
      p.scrollTo(x, y);
    }
  }
}

