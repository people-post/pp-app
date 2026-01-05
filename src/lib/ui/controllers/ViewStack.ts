import { Logger } from '../../ext/Logger.js';
import { URL_PARAM } from '../Constants.js';
import { RenderController } from './RenderController.js';
import { FNavBack } from './fragments/FNavBack.js';
import { ViewPanel } from '../renders/panels/ViewPanel.js';
import { VBlank } from './views/VBlank.js';
import { Events, T_ACTION } from '../../framework/Events.js';
import { View } from './views/View.js';
import { ListPanel } from '../renders/panels/ListPanel.js';
import { PreferredWidth } from './fragments/FViewContentBase.js';

const _CRC_NAVIGATION = {
  BIT : {NARROW : 1 << 1, WIDE_EXTRA : 1 << 0},
} as const;

interface FrameSize {
  offset: number;
  width: number;
}

interface ViewStackDataSource {
  getDefaultActionButtonForViewStack(vs: ViewStack): any;
}

interface ViewStackDelegate {
  onViewStackStackSizeChange(vs: ViewStack): void;
  onViewStackRequestPopView(vs: ViewStack): void;
  [key: string]: unknown;
}

export class ViewStack extends RenderController {
  #logger: Logger;
  #childStack: View[] = []; // First element as the top most view
  #shouldLockLastView: boolean = true;
  #shouldEnableSessionAction: boolean = false;
  #optionalViews: View[] = []; // Views only show up when there are free frames

  protected declare _dataSource: ViewStackDataSource;
  protected declare _delegate: ViewStackDelegate;

  constructor() {
    super();
    this.#logger = new Logger("ViewStack");
  }

  getStackSize(): number { return this.#childStack.length; }
  getNRealViews(): number {
    return this.#childStack.filter(v => !(this.#isOptionalView(v))).length;
  }

  getDefaultActionButtonForView(view: View): any {
    if (this.#shouldEnableSessionAction) {
      if (this.#childStack[0] == view) {
        return this._dataSource.getDefaultActionButtonForViewStack(this);
      }
    }
    return null;
  }

  setLockLastView(val: boolean): void { this.#shouldLockLastView = val; }
  setOptionalViews(vs: View[]): void { this.#optionalViews = vs; }
  setEnableSessionAction(b: boolean): void { this.#shouldEnableSessionAction = b; }

  init(): void {
    for (let c of this._getAllChildControllers()) {
      if (typeof (c as any).init === 'function') {
        (c as any).init();
      }
    }
  }

  initFromUrl(urlParam: URLSearchParams): void {
    this.#logger.debug("Init from url: " + urlParam);
    let vs = this._getActiveViews();
    urlParam.set(URL_PARAM.N_NAV_FRAME, vs.length.toString());
    for (let v of vs) {
      v.initFromUrl(urlParam);
    }
  }

  getUrlParamString(): string {
    let items: string[] = [];
    for (let v of this.#childStack) {
      let s = v.getUrlParamString();
      if (s && s.length) {
        items.push(s);
      }
    }
    return items.join("&");
  }

  onResize(): void { this.render(); }

  onNavBackFragmentClick(_fNavBack: FNavBack): void {
    if (this._owner) {
      (this._owner as any).onViewStackRequestPopView(this);
    }
  }

  onViewRequestPush(view: View, newView: View, title: string): void {
    // Clear all views after view then push newView
    if (this.#childStack.indexOf(view) >= 0 && view.isActive()) {
      if (view == this.#getTopRealView()) {
        this.#seguePushView(newView, title);
      } else {
        let nBefore = this.getNRealViews();
        while (this.getStackSize() && view != this.#childStack[0]) {
          this.#popView();
        }

        this.#pushViewElements(newView);
        this.#updateViewsVisiblity();

        if (nBefore != this.getNRealViews()) {
          this.#onStackSizeChange();
        }
        Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, title);
      }
    }
  }

  onViewRequestReplace(view: View, newView: View, title: string): void {
    if (view == this.#getTopRealView()) {
      newView.setOwner(this);
      let r = view.getRender();
      view.detachRender();
      let i = this.#childStack.indexOf(view);
      this.#childStack[i] = newView;
      if (this.getStackSize() > 0 && !this.#isOptionalView(newView)) {
        let ff = new FNavBack();
        ff.setDelegate(this);
        newView.setNavMenuFragment(ff);
      }
      if (r) {
        newView.attachRender(r);
        newView.render();
      }
      Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, title);
    }
  }

  onRequestPushView(view: View, title: string): void { this.#seguePushView(view, title); }

  onViewRequestPop(view: View): void {
    if (view == this.#getTopRealView()) {
      if (this._owner) {
        (this._owner as any).onViewStackRequestPopView(this);
      }
    }
  }

  knockKnock(): void {
    let v = this.#getTopRealView();
    if (v) {
      v.knockKnock();
    }
  }

  popState(_state: any): void { this.#seguePopView(); }

  pushView(view: View, title: string): void { this.onRequestPushView(view, title); }

  resetStack(viewStack: View[]): void {
    let nBefore = this.getNRealViews();
    for (let v of this.#childStack) {
      v.detachRender();
    }
    this.#childStack = [];

    let r = this.getRender();
    if (r && typeof (r as any).reset === 'function') {
      (r as any).reset();
    }

    for (let v of viewStack.reverse()) {
      this.#pushViewElements(v);
    }

    this.#updateViewsVisiblity();

    if (nBefore != this.getNRealViews()) {
      this.#onStackSizeChange();
    }
  }

  clearStackFrom(idx: number): void {
    if (idx < 0) {
      return;
    }
    let nBefore = this.getNRealViews();
    while (idx < this.getStackSize()) {
      this.#popView();
    }
    this.#updateViewsVisiblity();
    if (nBefore != this.getNRealViews()) {
      this.#onStackSizeChange();
    }
  }

  _getActiveViews(): View[] {
    return this.#childStack.filter(v => v.isActive()).reverse();
  }

  _getVisibleChildControllers(): any[] {
    let lLast = 1;
    let vs: any[] = [];
    for (let v of this.#childStack) {
      let r = v.getRender();
      let l = r ? r.getLeft() : 0;
      // Frist has largest offset, find until offset = 0
      if (l <= 0 && lLast <= 0) {
        break;
      } else {
        vs.push(v);
        lLast = l;
      }
    }
    return vs;
  }

  _getAllChildControllers(): any[] {
    return this.#childStack.concat(super._getAllChildControllers());
  }

  _renderOnRender(render: ListPanel): void {
    if (render.size() == 0) {
      this.#logger.debug("Reset stack");
      this.resetStack(Array.from(this.#childStack));
    } else {
      this.#updateViewsVisiblity();
    }
  }

  #onStackSizeChange(): void {
    if (this._owner) {
      (this._owner as any).onViewStackStackSizeChange(this);
    }
  }

  #getTopRealView(): View | undefined {
    return this.#childStack.find(v => !this.#isOptionalView(v));
  }

  #addFrame(listPanel: ListPanel, maxWidth: number): ViewPanel {
    let pl = 0;
    let v = this.#getTopRealView();
    if (v) {
      let r = v.getRender();
      if (r) {
        pl = (r.getLeft() + r.getWidth()) * 100 / listPanel.getWidth();
      }
    }
    let pw = 100 - pl;
    if (pw > 0 && maxWidth > 0) {
      pw = Math.min(pw, maxWidth * 100 / listPanel.getWidth());
    }
    let f = new ViewPanel();
    f.setClassName("f-frame flex flex-column");
    listPanel.pushPanel(f);
    f.setLeft(pl, "%");
    f.setWidth(pw, "%");
    return f;
  }

  #getViewFrameWrapper(viewIdx: number): ViewPanel | null {
    return this.#getFrameWrapper(this.getStackSize() - viewIdx - 1);
  }

  #getFrameWrapper(frameIdx: number): ViewPanel | null {
    let r = this.getRender();
    return r && typeof (r as any).getPanel === 'function' ? (r as any).getPanel(frameIdx) : null;
  }

  #updateViewsVisiblity(): void {
    this.#logger.debug("Update view visiblility");
    let r = this.getRender();
    if (!r) {
      this.#logger.debug("No render");
      return;
    }
    let w = r.getWidth();

    this.#popOptionalViews();

    // Determine visible frames
    let pws = this.#childStack.map(v => v.getPreferredWidth());
    let ws = this.#decideVisibleFrameSizes(w, pws);

    let nvFrames = ws.length;
    this.#pushOptionalViews(nvFrames);

    // Show/hide views
    for (let [i, v] of this.#childStack.entries()) {
      this.#logger.debug("Evaluating view stack: " + i);
      if (i < nvFrames) {
        let d = ws[i];
        // Check diffs, update narrow/wide settings
        let p = this.#getViewFrameWrapper(i);
        if (p) {
          let plOld = p.getLeft() * 100 / w;
          let pwOld = p.getWidth() * 100 / w;
          let plNew = d.offset * 100 / w;
          let pwNew = d.width * 100 / w;

          if (!v.isActive() || plOld != plNew || pwOld != pwNew) {
            p.animate(
                [
                  {
                    left : `${plOld}%`,
                    width : `${pwOld}%`,
                    visibility : "hidden"
                  },
                  {
                    transform : "scale(1)",
                    left : `${plNew}%`,
                    width : `${pwNew}%`,
                    visibility : "visible"
                  }
                ],
                {duration : 200, easing : "ease-out", fill : "forwards"});
            v.setActive(true);
          }
        }
        v.setEnableContentLeftBorder(i < nvFrames - 1);
      } else {
        // Animate hide overflow views on the left
        if (v.isActive()) {
          let p = this.#getViewFrameWrapper(i);
          if (p) {
            p.animate(
                [
                  {transform : "scale(1)", visibility : "visible"},
                  {transform : "scale(0.9)", visibility : "hidden"}
                ],
                {duration : 200, easing : "ease-out", fill : "forwards"});
          }
          v.setActive(false);
        } else {
          break;
        }
      }
    }

    if (this.#childStack.length) {
      this.#childStack[0].reloadActionButton();
    }
  }

  #seguePushView(view: View, title: string): void {
    this.#popOptionalViews();
    this.#pushViewElements(view);

    this.#updateViewsVisiblity();
    this.#onStackSizeChange();

    Events.triggerTopAction(T_ACTION.PUSH_STATE, {}, title);
  }

  #pushViewElements(view: View): void {
    view.setOwner(this);
    let r = this.getRender();
    if (r) {
      let pw = view.getPreferredWidth();
      let f = this.#addFrame(r as ListPanel, pw.max);
      if (this.getStackSize() > 0 && !this.#isOptionalView(view)) {
        let ff = new FNavBack();
        ff.setDelegate(this);
        view.setNavMenuFragment(ff);
      }
      view.attachRender(f);
    }
    this.#childStack.unshift(view);
    view.render();
  }

  #pushOptionalViews(nvFrames: number): void {
    let n = nvFrames - this.getStackSize();
    if (n > 0) {
      for (let v of this.#optionalViews) {
        this.#pushViewElements(v);
        if (--n == 0) {
          break;
        }
      }
      while (n-- > 0) {
        this.#pushViewElements(new VBlank());
      }
    }
  }

  #popOptionalViews(): void {
    while (this.#childStack.length > 0 && this.#isOptionalView(this.#childStack[0])) {
      this.#popView();
    }
  }

  #seguePopView(): void {
    // At least one is required
    if (this.getStackSize() < 1) {
      return;
    }

    if (this.#shouldLockLastView && this.getNRealViews() == 1) {
      return;
    }

    this.#popOptionalViews();
    this.#popView();
    this.#updateViewsVisiblity();
    this.#onStackSizeChange();
  }

  #popView(): void {
    let v = this.#childStack.shift();
    if (v) {
      v.detachRender();
      let r = this.getRender();
      if (r && typeof (r as any).pop === 'function') {
        (r as any).pop();
      }
    }
  }

  #isOptionalView(v: View): boolean {
    return this.#optionalViews.indexOf(v) >= 0 || v instanceof VBlank;
  }

  #decideVisibleFrameSizes(total: number, preferredWidths: PreferredWidth[]): FrameSize[] {
    let wTemp = total;
    let ws: FrameSize[] = [];
    // this.#logger.debug(preferredWidths.map(w => JSON.stringify(w)));
    for (let pw of preferredWidths) {
      if (pw.best == 0) {
        ws.push({"offset" : 0, "width" : wTemp});
        wTemp = 0;
        break;
      } else if (wTemp >= pw.best) {
        ws.push({"offset" : 0, "width" : pw.best});
        wTemp -= pw.best;
      } else if (wTemp >= pw.min) {
        // Last one, not wide enough to use best, but over min
        ws.push({"offset" : 0, "width" : wTemp});
        wTemp = 0;
        break;
      } else if (ws.length == 0) {
        // wTemp < pw.min, but is the first page
        ws.push({"offset" : 0, "width" : wTemp});
        wTemp = 0;
      } else {
        break;
      }
    }

    // Fill in top view until max
    if (ws.length > 0) {
      let d = ws[0];
      let pw = preferredWidths[0];
      if (pw.max <= 0) {
        d.width += wTemp;
        wTemp = 0;
      } else if (pw.max > d.width) {
        let dw = pw.max - d.width;
        if (dw > wTemp) {
          d.width += wTemp;
          wTemp = 0;
        } else {
          wTemp -= dw;
          d.width = pw.max;
        }
      }
    }

    // Add optional view, only support one for now
    // TODO: Consider optional view's preferred width
    let wv = 320;
    if (ws.length == preferredWidths.length && wTemp > wv) {
      ws.unshift({"offset" : 0, "width" : wTemp});
    } else {
      // Fill in remaining
      if (ws.length > 0) {
        ws[0].width += wTemp;
      }
    }

    // Determine offset
    wTemp = total;
    for (let d of ws) {
      wTemp -= d.width;
      d.offset = wTemp;
    }
    // this.#logger.debug(ws.map(w => JSON.stringify(w)));
    return ws;
  }
}

