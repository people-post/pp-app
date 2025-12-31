import { Controller } from '../../ext/Controller.js';
import { View } from './views/View.js';
import { FvcConfirmAction } from './views/FvcConfirmAction.js';

const _CRC_RENDER_CONTROLLER = {
  TIP_LINK :
      `<a class="knowledge-tip" href="javascript:void(0)" onclick="javascript:G.action(__ACTION_ID__, '__TIP_MSG_ID__')">__TEXT__</a>`,
  FATAL_MSG :
      `We are sorry, there is an unexpected error when __FUNC__: __TEXT__.`,
};

export class RenderController extends Controller {
  #isPrimeBg = false;
  #isActive;
  #render;
  #mChild;
  #mExtraRender;

  constructor() {
    super();
    this._owner = null;
    this.#isActive = true;
    this.#render = null;
    this.#mChild = new Map();
    this.#mExtraRender = new Map();
  }

  isActive() { return this.#isActive; }
  isAttached() { return !!this.#render; }
  isMenuRenderMode() { return this.#isPrimeBg; }
  isOwnedBy(other) {
    let o = this._owner;
    while (o) {
      if (o == other) {
        return true;
      }
      o = o._owner;
    }
    return false;
  }

  getRender() { return this.#render; }
  getUrlParamString() { return ""; }

  setVisible(b) {
    let r = this.getRender();
    if (!r) {
      return;
    }
    if (r.isVisible() != b) {
      if (!b) {
        this.setActive(false);
      }
      r.setVisible(b);
    }
  }

  setActive(b) {
    if (this.#isActive != b) {
      if (b) {
        this.setVisible(true);
      }
      this.#isActive = b;
    }
    if (b) {
      for (let c of this._getVisibleChildControllers()) {
        c.setActive(true);
      }
    } else {
      for (let c of this._getActiveChildControllers()) {
        c.setActive(false);
      }
    }
  }

  setOwner(owner) {
    if (this._owner) {
      this._owner.__onChildRenderControllerRequestReleaseOwnership(this);
    }
    this._owner = owner;
  }

  setChild(id, child) {
    // Detach existing child render controller
    let f = this.#mChild.get(id);
    if (f) {
      f.setOwner(null);
      f.detachRender();
    }
    if (child) {
      child.setOwner(this);
      this.#mChild.set(id, child);
      child.setMenuRenderMode(this.isMenuRenderMode());
    } else {
      this.#mChild.delete(id);
    }
  }

  // Render in primary bg color
  setMenuRenderMode(b) {
    this.#isPrimeBg = b;
    for (let c of this._getAllChildControllers()) {
      c.setMenuRenderMode(b);
    }
  }

  attachRender(render) {
    if (this.#render) {
      this.detachRender();
    }
    this.#render = render;
    if (this.#render) {
      this._onRenderAttached(this.#render);
    }
  }

  attachExtraRender(id, render) {
    // Detach existing first
    let r = this.#mExtraRender.get(id);
    if (r) {
      r.clear();
    }
    this.#mExtraRender.set(id, render);
    // Extra render do not generate attach event yet
  }

  detachRender() {
    this._onBeforeRenderDetach();
    for (let c of this._getAllChildControllers()) {
      c.detachRender();
    }
    if (this.#render) {
      this.#render.clear();
      this.#render = null;
    }
    for (let r of this.#mExtraRender.values()) {
      r.clear();
    }
    this.#mExtraRender.clear();
  }

  userAction() {
    if (this.isActive() && this._isEventSource(event)) {
      // console.debug(this.constructor.name + " handle event");
      for (let c of this._getActiveChildControllers()) {
        c.userAction.apply(c, arguments)
      }
      this.action.apply(this, arguments);
    }
  }

  scheduledAction() {
    if (this.isActive()) {
      this.action.apply(this, arguments);
    }
  }

  applyDataUpdate() {
    for (let c of this._getAllChildControllers()) {
      c.applyDataUpdate.apply(c, arguments);
    }
    this.handleSessionDataUpdate.apply(this, arguments);
  }

  init() {}
  action() {}
  handleSessionDataUpdate() {}

  render() {
    let r = this.getRender();
    if (r) {
      this._renderOnRender(r);
      this._onContentDidAppear();
    }
  }

  _onRenderAttached(render) {}
  _onBeforeRenderDetach() {}

  _isEventSource(evt) {
    if (this.#render && this.#render.isEventSource(evt)) {
      return true;
    }
    for (let r of this.#mExtraRender.values()) {
      if (r.isEventSource(evt)) {
        return true;
      }
    }
    return false;
  }

  _getChild(id) { return this.#mChild.get(id); }
  _getAllChildControllers() { return [...this.#mChild.values() ]; }
  _getActiveChildControllers() {
    return this._getAllChildControllers().filter(c => c.isActive());
  }
  _getVisibleChildControllers() { return this._getAllChildControllers(); }

  _renderOnRender(render) { render.replaceContent(this._renderContent()); }
  _renderContent() { return ""; }
  _onContentDidAppear() {}

  _clearChildren() {
    for (let f of this.#mChild.values()) {
      f.detachRender();
    }
    this.#mChild.clear();
  }

  _renderTipLink(actionId, text, tip) {
    let s = _CRC_RENDER_CONTROLLER.TIP_LINK;
    s = s.replace("__ACTION_ID__", actionId);
    s = s.replace("__TEXT__", text);
    s = s.replace("__TIP_MSG_ID__", tip);
    return s;
  }

  _fatal(funcName, responseText) {
    let s = _CRC_RENDER_CONTROLLER.FATAL_MSG;
    s = s.replace("__FUNC__", funcName);
    s = s.replace("__TEXT__", responseText);
    this._displayMessage(s);
  }

  _displayMessage(textCode) {
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_NOTICE, this,
                                R.get(textCode));
  }

  _confirmDangerousOperation(msg, func) {
    let v = new View();
    let f = new FvcConfirmAction();
    f.setMessage(msg);
    f.addOption("Yes", func, true);
    f.addOption("Cancel", null);
    v.setContentFragment(f);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
                                "Confirmation", false);
  }

  __onChildRenderControllerRequestReleaseOwnership(child) {
    for (let [id, c] of this.#mChild.entries()) {
      if (c == child) {
        this.#mChild.delete(id);
      }
    }
  }
}

