import { Panel } from '../../renders/panels/Panel.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { Layer } from './Layer.js';
import { FFragmentList } from '../fragments/FFragmentList.js';
import { Button } from '../fragments/Button.js';
import { Fragment } from '../fragments/Fragment.js';

export const CL_CONTEXT = {
  CLOSE : Symbol(),
} as const;

const _CLT_CONTEXT = {
  MAIN : `<div id="__ID_TITLE__" class="s-font3"></div>
  <div id="__ID_DESCRIPTION__" class="s-font4"></div>
  <br>
  <div id="__ID_CONTENT__" class="hmax300px y-scroll no-scrollbar"></div>
  <br>
  <div id="__ID_BTN_CANCEL__"></div>`,
} as const;

class PContextLayer extends Panel {
  #pTitle: Panel;
  #pDescription: Panel;
  #pContent: ListPanel;
  #btnCancel: PanelWrapper;

  constructor() {
    super();
    this.#pTitle = new Panel();
    this.#pDescription = new Panel();
    this.#pContent = new ListPanel();
    this.#btnCancel = new PanelWrapper();
  }

  getTitlePanel(): Panel { return this.#pTitle; }
  getDescriptionPanel(): Panel { return this.#pDescription; }
  getContentPanel(): ListPanel { return this.#pContent; }
  getBtnCancelPanel(): PanelWrapper { return this.#btnCancel; }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pDescription.attach(this._getSubElementId("D"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#btnCancel.attach(this._getSubElementId("B"));
  }

  _renderFramework(): string {
    let s = _CLT_CONTEXT.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_BTN_CANCEL__", this._getSubElementId("B"));
    return s;
  }
}

const _CL_CONTEXT = {
  TITLE : `__TITLE__:`,
} as const;

interface LContextDelegate {
  onOptionClickedInContextLayer(l: LContext, value: unknown): void;
}

export class LContext extends Layer {
  #title: string | null = null;
  #description: string | null = null;
  #fOptions: FFragmentList;
  #btnCancel: Button;

  protected declare _delegate: LContextDelegate;

  constructor() {
    super();
    this.#fOptions = new FFragmentList();
    this.setChild("options", this.#fOptions);

    this.#btnCancel = new Button();
    this.#btnCancel.setThemeType(Button.T_THEME.PALE);
    this.#btnCancel.setName("Cancel");
    this.#btnCancel.setDelegate(this);
    this.setChild("btnCancel", this.#btnCancel);
  }

  setTargetName(name: string): void {
    if (name && name.length) {
      this.#title = "Options for " + name;
    } else {
      this.#title = null;
    }
  }
  setDescription(d: string): void { this.#description = d; }

  addOption(name: string, value: unknown, icon: string | null = null, themeType: unknown = null, isEnabled: boolean = true): void {
    let f = new Button();
    f.setName(name);
    f.setIcon(icon);
    f.setEnabled(isEnabled);
    f.setValue(value);
    f.setThemeType(themeType);
    f.setDelegate(this);
    this.#fOptions.append(f);
  }

  addOptionFragment(f: Fragment): void { this.#fOptions.append(f); }

  // These are hacks, should have more generic structure for fragment protocols
  onRemoteErrorInFragment(_f: Fragment, e: unknown): void {
    console.log("onRemoteErrorInFragment not implemented in LContext");
    console.log(e);
  }
  onLocalErrorInFragment(_f: Fragment, msg: string): void {
    console.log("onLocalErrorInFragment not implemented in LContext");
    console.log(msg);
  }
  onFragmentRequestShowView(_f: Fragment, _view: any, _title: string): void {
    console.log("onFragmentRequestShowView not implemented in LContext");
  }

  clearOptions(): void { this.#fOptions.clear(); }

  dismiss(): void {
    if (this._owner) {
      (this._owner as any).onRequestPopLayer(this);
    }
  }

  onSimpleButtonClicked(fBtn: Button): void {
    this.#onClose();
    if (fBtn != this.#btnCancel) {
      this._delegate.onOptionClickedInContextLayer(this, fBtn.getValue());
    }
  }

  _renderOnRender(render: any): void {
    // Animate when render for the first time, this might be a hack
    let shouldAnimate = !(render as any).getContentPanel();

    let panel = new PanelWrapper();
    panel.setClassName("w100 h100 context-layer flex flex-column flex-end");
    panel.setAttribute("onclick", "javascript:G.action(window.CL_CONTEXT.CLOSE)");
    render.wrapPanel(panel);

    let p = new PanelWrapper();
    p.setClassName("w100 flex flex-center relative");
    panel.wrapPanel(p);

    panel = new PContextLayer();
    panel.setClassName(
        "w100 s-csecondarybg bdlightgray border-box context-content");
    panel.setAttribute("onclick", "javascript:G.anchorClick()");
    p.wrapPanel(panel);

    p = panel.getTitlePanel();
    p.replaceContent(this.#renderTitle(this.#title));

    if (this.#description) {
      p = panel.getDescriptionPanel();
      p.replaceContent(this.#description);
    }

    // Hack to allow events being recognized in this.#fOptions
    p = panel.getContentPanel();
    this.#fOptions.attachRender(p);

    for (let f of this.#fOptions.getChildren()) {
      let pp = new PanelWrapper();
      p.pushPanel(pp);
      f.attachRender(pp);
      f.render();
      p.pushSpace(1);
    }

    p = panel.getBtnCancelPanel();
    this.#btnCancel.attachRender(p);
    this.#btnCancel.render();

    if (shouldAnimate) {
      panel.animate([ {bottom : `-${panel.getHeight()}px`}, {bottom : "0px"} ],
                    {duration : 200, easing : [ "ease-out" ]});
    }
  }

  action(type: symbol, ..._args: unknown[]): void {
    switch (type) {
    case CL_CONTEXT.CLOSE:
      this.#onClose();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  popState(_state: any): void {}

  #renderTitle(title: string | null): string {
    let s = _CL_CONTEXT.TITLE;
    if (title && title.length) {
      s = s.replace("__TITLE__", title);
    } else {
      s = s.replace("__TITLE__", "Options");
    }
    return s;
  }
  #onClose(): void { this.dismiss(); }
}

// Export to window for string template access
if (typeof window !== 'undefined') {
  (window as any).CL_CONTEXT = CL_CONTEXT;
}

