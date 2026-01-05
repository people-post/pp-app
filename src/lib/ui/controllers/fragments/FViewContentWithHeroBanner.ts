import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { FViewContentWrapper } from './FViewContentWrapper.js';
import { Fragment } from './Fragment.js';

const _CPT_VIEW_CONTENT_WITH_HERO_BANNER = {
  MAIN : `<div id="__ID_HEADER__" class="flex-noshrink"></div>
  <div id="__ID_CONTENT__" class="flex-grow y-no-overflow"></div>`,
} as const;

class PViewContentWithHeroBanner extends Panel {
  #pHeader: PanelWrapper;
  #pContent: PanelWrapper;

  constructor() {
    super();
    this.#pHeader = new PanelWrapper();
    this.#pContent = new PanelWrapper();
  }

  getHeaderPanel(): PanelWrapper { return this.#pHeader; }
  getContentPanel(): PanelWrapper { return this.#pContent; }

  _renderFramework(): string {
    let s: string = _CPT_VIEW_CONTENT_WITH_HERO_BANNER.MAIN;
    s = s.replace("__ID_HEADER__", this._getSubElementId("H") as string);
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C") as string);
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pHeader.attach(this._getSubElementId("H"));
    this.#pContent.attach(this._getSubElementId("C"));
  }
}

export class FViewContentWithHeroBanner extends FViewContentWrapper {
  // Hero banner will act on content scroll
  #fHeroBanner: Fragment | null = null;
  #pHeader: PanelWrapper | null = null;
  #shouldAutoHide: boolean = false;
  #mActiveTouch: Map<number, Touch> = new Map();
  #isBannerVisible: boolean = false;
  #threashold: number = 10; // Threshold to do action

  setHeroBannerFragment(f: Fragment): void {
    this.#fHeroBanner = f;
    this.setChild("herobanner", f);
  }

  setEnableAutoHide(b: boolean): void { this.#shouldAutoHide = b; }

  _renderOnRender(render: any): void {
    let panel = new PViewContentWithHeroBanner();
    panel.setClassName("h100 flex flex-column");
    render.wrapPanel(panel);
    if (this.#shouldAutoHide) {
      let e = panel.getDomElement();
      if (e) {
        e.addEventListener("touchstart", evt => this.#onTouchStart(evt));
        e.addEventListener("touchcancel", evt => this.#onTouchCancel(evt));
        e.addEventListener("touchmove", evt => this.#onTouchMove(evt));
        e.addEventListener("wheel", evt => this.#onWheelEvent(evt));
      }
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

  #onWheelEvent(evt: WheelEvent): void {
    // dy > 0 is wheel down but screen up, need to invert sign
    let dy = -evt.deltaY;
    if (dy > 0) {
      this.#showBanner();
    } else if (dy < 0) {
      this.#hideBanner();
    }
  }

  #hideBanner(): void {
    if (this.#isBannerVisible && this.#pHeader) {
      this.#pHeader.animate(
          [ {height : ""}, {height : "0px"} ],
          {duration : 1000, easing : "ease-out", fill : "forwards"});
      this.#isBannerVisible = false;
    }
  }

  #showBanner(): void {
    if (!this.#isBannerVisible && this.#pHeader) {
      this.#pHeader.animate(
          [ {height : "0px"}, {height : ""} ],
          {duration : 1000, easing : "ease-out", fill : "forwards"});
      this.#isBannerVisible = true;
    }
  }

  #onTouchStart(evt: TouchEvent): void {
    for (let t of evt.changedTouches) {
      this.#mActiveTouch.set(t.identifier, t);
    }

    // Touch start is called per touch, only allow single touch here
    if (this.#mActiveTouch.size > 1) {
      this.#onTouchCancel();
    }
  }

  #onTouchCancel(_evt?: TouchEvent): void {
    if (this.#mActiveTouch.size > 0) {
      this.#mActiveTouch.clear();
    }
  }

  #onTouchMove(evt: TouchEvent): void {
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
}

