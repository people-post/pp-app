import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { FViewContentWrapper } from './FViewContentWrapper.js';
import { ScrollEndEventShim } from '../../../ext/ScrollEndEventShim.js';
import { FElasticRefresh } from './FElasticRefresh.js';

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
};

class PScrollViewContentHook extends Panel {
  #pElasticRefresh;
  #pContentContainer;
  #pContent;
  #pBstt;

  constructor() {
    super();
    this.#pElasticRefresh = new PanelWrapper();
    this.#pContentContainer = new Panel();
    this.#pContent = new PanelWrapper();
    this.#pBstt = new Panel();
  }

  getElasticRefreshPanel() { return this.#pElasticRefresh; }
  getContentContainerPanel() { return this.#pContentContainer; }
  getContentPanel() { return this.#pContent; }
  getBsttPanel() { return this.#pBstt; }

  _renderFramework() {
    let s = _CPT_SCROLL_VIEW_CONTENT_HOOK.MAIN;
    s = s.replace("__ID_ELASTIC_REFRESH__", this._getSubElementId("R"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_BSTT__", this._getSubElementId("B"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pElasticRefresh.attach(this._getSubElementId("R"));
    this.#pContentContainer.attach(this._getSubElementId("C"));
    this.#pBstt.attach(this._getSubElementId("B"));

    let s = _CPT_SCROLL_VIEW_CONTENT_HOOK.CONTENT;
    let id = this._getSubElementId("CC");
    s = s.replace("__ID_CONTENT__", id);
    this.#pContentContainer.replaceContent(s);
    this.#pContent.attach(id);
  }
};

export const CF_SCROLL_VIEW_CONTENT_HOOK = {
  SCROLL_TO_TOP : Symbol(),
};

// Export to window for string template access
if (typeof window !== 'undefined') {
  window.CF_SCROLL_VIEW_CONTENT_HOOK = CF_SCROLL_VIEW_CONTENT_HOOK;
}

export class FScrollViewContentHook extends FViewContentWrapper {
  #fElasticRefresh;
  #sScrollEvt;
  #pMain = null;
  #scrollYBeforeTopResize = null;

  constructor(fContent) {
    super();
    this.#sScrollEvt = new ScrollEndEventShim();
    this.#sScrollEvt.setDelegate(this);

    this.#fElasticRefresh = new FElasticRefresh();
    this.#fElasticRefresh.setDataSource(this);
    this.#fElasticRefresh.setDelegate(this);
    this.setChild("__elasticrefresh", this.#fElasticRefresh);
    this.wrapContentFragment(fContent);
  }

  shouldElasticRefreshFragmentEngage(fElasticRefresh) {
    return this.#isReadyForPullToRefresh();
  }

  onScrollEndInScrollEndEventShim(sScrollEnd) { this.#onScrollEnd(); }
  onElasticRefreshFragmentRequstRefresh(fElasticRefresh) {
    this._getContentFragment().reload();
  }

  onContentTopResizeBeginInFragment(f) {
    this.#scrollYBeforeTopResize = this.#getScrollY();
  }
  onContentTopResizeEndInFragment(f) {
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

  knockKnock() {
    super.knockKnock();
    this.#scrollToTop();
  }

  action(type, ...args) {
    switch (type) {
    case CF_SCROLL_VIEW_CONTENT_HOOK.SCROLL_TO_TOP:
      this.#scrollToTop();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let panel = new PScrollViewContentHook();
    panel.setClassName("h100 flex flex-column");
    render.wrapPanel(panel);
    this.#pMain = panel;

    let p = panel.getElasticRefreshPanel();
    this.#fElasticRefresh.attachRender(p);
    this.#fElasticRefresh.render();

    p = panel.getBsttPanel();
    p.replaceContent("Back to top");
    p.setVisible(false);
    p.setAttribute(
        "onclick",
        "javascript:G.action(window.CF_SCROLL_VIEW_CONTENT_HOOK.SCROLL_TO_TOP)");

    p = panel.getContentContainerPanel();
    this.#sScrollEvt.observe(p.getDomElement());

    p = panel.getContentPanel();
    if (this._getContentFragment().isReloadable()) {
      this.#fElasticRefresh.observe(p.getDomElement());
    }

    let f = this._getContentFragment();
    f.attachRender(p);
    f.render();
  }

  #isReadyForPullToRefresh() {
    if (this._getContentFragment().hasHiddenTopBuffer()) {
      return false;
    }
    let yObj = this.#getScrollY();
    if (yObj && yObj.value == 0) {
      return true;
    }
    return false;
  }

  #getScrollY() {
    let p = this.#pMain ? this.#pMain.getContentContainerPanel() : null;
    if (p) {
      return p.getScrollY();
    }
    return null;
  }

  #onScrollEnd() {
    let pSttb = this.#pMain ? this.#pMain.getBsttPanel() : null;
    if (pSttb) {
      let yObj = this.#getScrollY();
      pSttb.setVisible(yObj && yObj.value > 500);
    }
    this._getContentFragment().onScrollFinished();
  }

  #scrollToTop() {
    this._getContentFragment().scrollToTop();
    this.#scrollTo(0, 0);
    // Render is needed to avoid blank screen although not fully understand why
    this.render();
  }

  #scrollTo(x, y) {
    let p = this.#pMain ? this.#pMain.getContentContainerPanel() : null;
    if (p) {
      p.scrollTo(x, y);
    }
  }
};
