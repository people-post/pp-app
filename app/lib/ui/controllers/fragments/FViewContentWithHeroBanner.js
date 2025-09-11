(function(ui) {
const _CPT_VIEW_CONTENT_WITH_HERO_BANNER = {
  MAIN : `<div id="__ID_HEADER__" class="flex-noshrink"></div>
  <div id="__ID_CONTENT__" class="flex-grow y-no-overflow"></div>`,
};

class PViewContentWithHeroBanner extends ui.Panel {
  #pHeader;
  #pContent;

  constructor() {
    super();
    this.#pHeader = new ui.PanelWrapper();
    this.#pContent = new ui.PanelWrapper();
  }

  getHeaderPanel() { return this.#pHeader; }
  getContentPanel() { return this.#pContent; }

  _renderFramework() {
    let s = _CPT_VIEW_CONTENT_WITH_HERO_BANNER.MAIN;
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

class FViewContentWithHeroBanner extends ui.FViewContentWrapper {
  // Hero banner will act on content scroll
  #fHeroBanner = null;
  #pHeader = null;
  #shouldAutoHide = false;
  #mActiveTouch = new Map();
  #isBannerVisible = false;
  #threashold = 10; // Threshold to do action

  setHeroBannerFragment(f) {
    this.#fHeroBanner = f;
    this.setChild("herobanner", this.#fHeroBanner);
  }

  setEnableAutoHide(b) { this.#shouldAutoHide = b; }

  _renderOnRender(render) {
    let panel = new PViewContentWithHeroBanner();
    panel.setClassName("h100 flex flex-column");
    render.wrapPanel(panel);
    if (this.#shouldAutoHide) {
      let e = panel.getDomElement();
      e.addEventListener("touchstart", evt => this.#onTouchStart(evt));
      e.addEventListener("touchcancel", evt => this.#onTouchCancel(evt));
      e.addEventListener("touchmove", evt => this.#onTouchMove(evt));
      e.addEventListener("wheel", evt => this.#onWheelEvent(evt));
    }

    let p = panel.getHeaderPanel();
    if (this.#fHeroBanner) {
      this.#fHeroBanner.attachRender(p);
      this.#fHeroBanner.render();
      this.#isBannerVisible = true;
    }
    this.#pHeader = p;

    p = panel.getContentPanel();
    let f = this._getContentFragment();
    if (f) {
      f.attachRender(p);
      f.render();
    }
  }

  #onWheelEvent(evt) {
    // dy > 0 is wheel down but screen up, need to invert sign
    let dy = -evt.deltaY;
    if (dy > 0) {
      this.#showBanner();
    } else if (dy < 0) {
      this.#hideBanner();
    }
  }

  #hideBanner() {
    if (this.#isBannerVisible) {
      this.#pHeader.animate(
          [ {height : ""}, {height : "0px"} ],
          {duration : 1000, easing : [ "ease-out" ], fill : "forwards"});
      this.#isBannerVisible = false;
    }
  }

  #showBanner() {
    if (!this.#isBannerVisible) {
      this.#pHeader.animate(
          [ {height : "0px"}, {height : ""} ],
          {duration : 1000, easing : [ "ease-out" ], fill : "forwards"});
      this.#isBannerVisible = true;
    }
  }

  #onTouchStart(evt) {
    for (let t of evt.changedTouches) {
      this.#mActiveTouch.set(t.identifier, t);
    }

    // Touch start is called per touch, only allow single touch here
    if (this.#mActiveTouch.size > 1) {
      this.#onTouchCancel();
    }
  }

  #onTouchCancel(evt) {
    if (this.#mActiveTouch.size > 0) {
      this.#mActiveTouch.clear();
    }
  }

  #onTouchMove(evt) {
    // Should only have 1 touch (See #onTouchStart)
    if (this.#mActiveTouch.size != 1) {
      return;
    }

    let t = evt.changedTouches[0];
    let tLast = this.#mActiveTouch.get(t.identifier);
    if (tLast) {
      let dy = t.pageY - tLast.pageY;
      this.#mActiveTouch.set(t.identifier, t);
      if (this.#isBannerVisible && dy < -this.#threashold) {
        evt.preventDefault();
        this.#hideBanner();
        this.#onTouchCancel();
      } else if (!this.#isBannerVisible && dy > this.#threashold) {
        evt.preventDefault();
        this.#showBanner();
        this.#onTouchCancel();
      }
    }
  }
};

ui.FViewContentWithHeroBanner = FViewContentWithHeroBanner;
}(window.ui = window.ui || {}));
