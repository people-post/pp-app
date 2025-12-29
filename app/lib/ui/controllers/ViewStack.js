import { Logger } from '../../ext/Logger.js';
import { URL_PARAM } from '../Constants.js';

(function(ui) {
const _CRC_NAVIGATION = {
  BIT : {NARROW : 1 << 1, WIDE_EXTRA : 1 << 0},
};

class ViewStack extends ui.RenderController {
  #logger;
  #childStack = []; // First element as the top most view
  #shouldLockLastView = true;
  #shouldEnableSessionAction = false;
  #optionalViews = []; // Views only show up when there are free frames

  constructor() {
    super();
    this.#logger = new Logger("ViewStack");
  }

  getStackSize() { return this.#childStack.length; }
  getNRealViews() {
    return this.#childStack.filter(v => !(this.#isOptionalView(v))).length;
  }

  getDefaultActionButtonForView(view) {
    if (this.#shouldEnableSessionAction) {
      if (this.#childStack[0] == view) {
        return this._dataSource.getDefaultActionButtonForViewStack(this);
      }
    }
    return null;
  }

  setLockLastView(val) { this.#shouldLockLastView = val; }
  setOptionalViews(vs) { this.#optionalViews = vs; }
  setEnableSessionAction(b) { this.#shouldEnableSessionAction = b; }

  init() {
    for (let c of this._getAllChildControllers()) {
      c.init();
    }
  }

  initFromUrl(urlParam) {
    this.#logger.debug("Init from url: " + urlParam);
    let vs = this._getActiveViews();
    urlParam.set(URL_PARAM.N_NAV_FRAME, vs.length);
    for (let v of vs) {
      v.initFromUrl(urlParam);
    }
  }

  getUrlParamString() {
    let items = [];
    for (let v of this.#childStack) {
      let s = v.getUrlParamString();
      if (s && s.length) {
        items.push(s);
      }
    }
    return items.join("&");
  }

  onResize() { this.render(); }

  onNavBackFragmentClick(fNavBack) {
    this._owner.onViewStackRequestPopView(this);
  }

  onViewRequestPush(view, newView, title) {
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
        fwk.Events.triggerTopAction(fwk.T_ACTION.REPLACE_STATE, {}, title);
      }
    }
  }

  onViewRequestReplace(view, newView, title) {
    if (view == this.#getTopRealView()) {
      newView.setOwner(this);
      let r = view.getRender();
      view.detachRender();
      let i = this.#childStack.indexOf(view);
      this.#childStack[i] = newView;
      if (this.getStackSize() > 0 && !this.#isOptionalView(newView)) {
        let ff = new ui.FNavBack();
        ff.setDelegate(this);
        newView.setNavMenuFragment(ff);
      }
      newView.attachRender(r);
      newView.render();
      fwk.Events.triggerTopAction(fwk.T_ACTION.REPLACE_STATE, {}, title);
    }
  }

  onRequestPushView(view, title) { this.#seguePushView(view, title); }

  onViewRequestPop(view) {
    if (view == this.#getTopRealView()) {
      this._owner.onViewStackRequestPopView(this);
    }
  }

  knockKnock() {
    let v = this.#getTopRealView();
    if (v) {
      v.knockKnock();
    }
  }

  popState(state) { this.#seguePopView(); }

  pushView(view, title) { this.onRequestPushView(view, title); }

  resetStack(viewStack) {
    let nBefore = this.getNRealViews();
    for (let v of this.#childStack) {
      v.detachRender();
    }
    this.#childStack = [];

    let r = this.getRender();
    if (r) {
      r.reset();
    }

    for (let v of viewStack.reverse()) {
      this.#pushViewElements(v);
    }

    this.#updateViewsVisiblity();

    if (nBefore != this.getNRealViews()) {
      this.#onStackSizeChange();
    }
  }

  clearStackFrom(idx) {
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

  _getActiveViews() {
    return this.#childStack.filter(v => v.isActive()).reverse();
  }

  _getVisibleChildControllers() {
    let lLast = 1;
    let vs = [];
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

  _getAllChildControllers() {
    return this.#childStack.concat(super._getAllChildControllers());
  }

  _renderOnRender(render) {
    if (render.size() == 0) {
      this.#logger.debug("Reset stack");
      this.resetStack(Array.from(this.#childStack));
    } else {
      this.#updateViewsVisiblity();
    }
  }

  #onStackSizeChange() { this._owner.onViewStackStackSizeChange(this); }

  #getTopRealView() {
    return this.#childStack.find(v => !this.#isOptionalView(v));
  }

  #addFrame(listPanel, maxWidth) {
    let pl = 0;
    let v = this.#getTopRealView();
    if (v) {
      let r = v.getRender();
      pl = (r.getLeft() + r.getWidth()) * 100 / listPanel.getWidth();
    }
    let pw = 100 - pl;
    if (pw > 0 && maxWidth > 0) {
      pw = Math.min(pw, maxWidth * 100 / listPanel.getWidth());
    }
    let f = new ui.ViewPanel();
    f.setClassName("f-frame flex flex-column");
    listPanel.pushPanel(f);
    f.setLeft(pl, "%");
    f.setWidth(pw, "%");
    return f;
  }

  #getViewFrameWrapper(viewIdx) {
    return this.#getFrameWrapper(this.getStackSize() - viewIdx - 1);
  }

  #getFrameWrapper(frameIdx) {
    let r = this.getRender();
    return r ? r.getPanel(frameIdx) : null;
  }

  #updateViewsVisiblity() {
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
                    visiblity : "hidden"
                  },
                  {
                    transform : "scale(1)",
                    left : `${plNew}%`,
                    width : `${pwNew}%`,
                    visiblity : "visible"
                  }
                ],
                {duration : 200, easing : [ "ease-out" ], fill : "forwards"});
            v.setActive(true);
          }
        }
        v.setEnableContentLeftBorder(i < nvFrames - 1);
      } else {
        // Animate hide overflow views on the left
        if (v.isActive()) {
          let p = this.#getViewFrameWrapper(i);
          p.animate(
              [
                {transform : "scale(1)", visiblity : "visible"},
                {transform : "scale(0.9)", visiblity : "hidden"}
              ],
              {duration : 200, easing : [ "ease-out" ], fill : "forwards"});
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

  #seguePushView(view, title) {
    this.#popOptionalViews();
    this.#pushViewElements(view);

    this.#updateViewsVisiblity();
    this.#onStackSizeChange();

    fwk.Events.triggerTopAction(fwk.T_ACTION.PUSH_STATE, {}, title);
  }

  #pushViewElements(view) {
    view.setOwner(this);
    let r = this.getRender();
    if (r) {
      let f = this.#addFrame(r, view.getPreferredWidth().max);
      let p = f.getHeaderPanel();
      if (this.getStackSize() > 0 && !this.#isOptionalView(view)) {
        let ff = new ui.FNavBack();
        ff.setDelegate(this);
        view.setNavMenuFragment(ff);
      }
      view.attachRender(f);
    }
    this.#childStack.unshift(view);
    view.render();
  }

  #pushOptionalViews(nvFrames) {
    let n = nvFrames - this.getStackSize();
    if (n > 0) {
      for (let v of this.#optionalViews) {
        this.#pushViewElements(v);
        if (--n == 0) {
          break;
        }
      }
      while (n-- > 0) {
        this.#pushViewElements(new ui.VBlank());
      }
    }
  }

  #popOptionalViews() {
    while (this.#isOptionalView(this.#childStack[0])) {
      this.#popView();
    }
  }

  #seguePopView() {
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

  #popView() {
    let v = this.#childStack.shift();
    v.detachRender();
    let r = this.getRender();
    r.pop();
  }

  #isOptionalView(v) {
    return this.#optionalViews.indexOf(v) >= 0 || v instanceof ui.VBlank;
  }

  #decideVisibleFrameSizes(total, preferredWidths) {
    let wTemp = total;
    let ws = [];
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

ui.ViewStack = ViewStack;
}(window.ui = window.ui || {}));
