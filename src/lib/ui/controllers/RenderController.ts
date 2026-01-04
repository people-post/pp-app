import { Controller } from '../../ext/Controller.js';
import { Factory, T_CATEGORY, T_OBJ } from '../../framework/Factory.js';
import { Events, T_ACTION } from '../../framework/Events.js';
import { R } from '../../../common/constants/R.js';
import type Render from '../renders/Render.js';

const _CRC_RENDER_CONTROLLER = {
  TIP_LINK :
      `<a class="knowledge-tip" href="javascript:void(0)" onclick="javascript:G.action(__ACTION_ID__, '__TIP_MSG_ID__')">__TEXT__</a>`,
  FATAL_MSG :
      `We are sorry, there is an unexpected error when __FUNC__: __TEXT__.`,
} as const;

export class RenderController extends Controller {
  #isPrimeBg: boolean = false;
  #isActive: boolean;
  #render: Render | null;
  #mChild: Map<string, RenderController>;
  #mExtraRender: Map<string, Render>;

  constructor() {
    super();
    this._owner = null;
    this.#isActive = true;
    this.#render = null;
    this.#mChild = new Map();
    this.#mExtraRender = new Map();
  }

  isActive(): boolean { return this.#isActive; }
  isAttached(): boolean { return !!this.#render; }
  isMenuRenderMode(): boolean { return this.#isPrimeBg; }
  isOwnedBy(other: RenderController | null): boolean {
    let o: RenderController | null = this._owner as RenderController | null;
    while (o) {
      if (o == other) {
        return true;
      }
      o = o._owner as RenderController | null;
    }
    return false;
  }

  getRender(): Render | null { return this.#render; }
  getUrlParamString(): string { return ""; }

  setVisible(b: boolean): void {
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

  setActive(b: boolean): void {
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

  setOwner(owner: RenderController | null): void {
    if (this._owner) {
      (this._owner as any).__onChildRenderControllerRequestReleaseOwnership(this);
    }
    this._owner = owner;
  }

  setChild(id: string, child: RenderController | null): void {
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
  setMenuRenderMode(b: boolean): void {
    this.#isPrimeBg = b;
    for (let c of this._getAllChildControllers()) {
      c.setMenuRenderMode(b);
    }
  }

  attachRender(render: Render): void {
    if (this.#render) {
      this.detachRender();
    }
    this.#render = render;
    if (this.#render) {
      this._onRenderAttached(this.#render);
    }
  }

  attachExtraRender(id: string, render: Render): void {
    // Detach existing first
    let r = this.#mExtraRender.get(id);
    if (r) {
      r.clear();
    }
    this.#mExtraRender.set(id, render);
    // Extra render do not generate attach event yet
  }

  detachRender(): void {
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

  userAction(): void {
    if (this.isActive() && this._isEventSource(event as Event)) {
      // console.debug(this.constructor.name + " handle event");
      for (let c of this._getActiveChildControllers()) {
        c.userAction.apply(c, arguments as any);
      }
      this.action.apply(this, arguments as any);
    }
  }

  scheduledAction(): void {
    if (this.isActive()) {
      this.action.apply(this, arguments as any);
    }
  }

  applyDataUpdate(): void {
    for (let c of this._getAllChildControllers()) {
      c.applyDataUpdate.apply(c, arguments as any);
    }
    this.handleSessionDataUpdate.apply(this, arguments as any);
  }

  init(): void {}
  action(_type?: any, ..._args: any[]): void {}
  handleSessionDataUpdate(_dataType?: any, _data?: any): void {}

  render(): void {
    let r = this.getRender();
    if (r) {
      this._renderOnRender(r);
      this._onContentDidAppear();
    }
  }

  _onRenderAttached(render: Render): void {}
  _onBeforeRenderDetach(): void {}

  _isEventSource(evt: Event): boolean {
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

  _getChild(id: string): RenderController | undefined { return this.#mChild.get(id); }
  _getAllChildControllers(): RenderController[] { return [...this.#mChild.values() ]; }
  _getActiveChildControllers(): RenderController[] {
    return this._getAllChildControllers().filter(c => c.isActive());
  }
  _getVisibleChildControllers(): RenderController[] { return this._getAllChildControllers(); }

  _renderOnRender(render: Render): void { render.replaceContent(this._renderContent()); }
  _renderContent(): string { return ""; }
  _onContentDidAppear(): void {}

  _clearChildren(): void {
    for (let f of this.#mChild.values()) {
      f.detachRender();
    }
    this.#mChild.clear();
  }

  _renderTipLink(actionId: string, text: string, tip: string): string {
    let s: string = _CRC_RENDER_CONTROLLER.TIP_LINK;
    s = s.replace("__ACTION_ID__", actionId);
    s = s.replace("__TEXT__", text);
    s = s.replace("__TIP_MSG_ID__", tip);
    return s;
  }

  _fatal(funcName: string, responseText: string): void {
    let s: string = _CRC_RENDER_CONTROLLER.FATAL_MSG;
    s = s.replace("__FUNC__", funcName);
    s = s.replace("__TEXT__", responseText);
    this._displayMessage(s);
  }

  _displayMessage(textCode: string): void {
    Events.triggerTopAction(T_ACTION.SHOW_NOTICE, this,
                                R.get(textCode));
  }

  _confirmDangerousOperation(msg: string, func: (() => void) | null): void {
    // Use Factory to get View and FvcConfirmAction classes to break circular dependency
    const ViewClass = Factory.getClass(T_CATEGORY.UI, T_OBJ.VIEW) as any;
    if (!ViewClass) {
      console.error('View class not registered in Factory');
      return;
    }
    const ConfirmActionClass = Factory.getClass(T_CATEGORY.UI, T_OBJ.CONFIRM_ACTION_FRAGMENT) as any;
    if (!ConfirmActionClass) {
      console.error('FvcConfirmAction class not registered in Factory');
      return;
    }
    let v = new ViewClass();
    let f = new ConfirmActionClass();
    f.setMessage(msg);
    f.addOption("Yes", func, true);
    f.addOption("Cancel", null);
    v.setContentFragment(f);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                "Confirmation", false);
  }

  __onChildRenderControllerRequestReleaseOwnership(child: RenderController): void {
    for (let [id, c] of this.#mChild.entries()) {
      if (c == child) {
        this.#mChild.delete(id);
      }
    }
  }
}

