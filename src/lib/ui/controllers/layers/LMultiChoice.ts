import { Panel } from '../../renders/panels/Panel.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { Layer } from './Layer.js';
import { FFragmentList } from '../fragments/FFragmentList.js';
import { Button } from '../fragments/Button.js';
import { View } from '../views/View.js';

export const CL_MULTI_CHOICE = {
  CLOSE : Symbol(),
} as const;

const _CLT_MULTI_CHOICE = {
  MAIN : `<div id="__ID_TITLE__" class="s-font3"></div>
  <div id="__ID_DESCRIPTION__" class="s-font4"></div>
  <br>
  <div class="hmax300px y-scroll no-scrollbar">
    <div id="__ID_CHOICES__"></div>
    <div id="__ID_ALTERNATIVES__"></div>
  </div>
  <br>
  <div id="__ID_BTN_CANCEL__"></div>`,
} as const;

class PMultiChoiceLayer extends Panel {
  #pTitle: Panel;
  #pDescription: Panel;
  #pChoices: ListPanel;
  #pAlternatives: ListPanel;
  #btnCancel: PanelWrapper;

  constructor() {
    super();
    this.#pTitle = new Panel();
    this.#pDescription = new Panel();
    this.#pChoices = new ListPanel();
    this.#pAlternatives = new ListPanel();
    this.#btnCancel = new PanelWrapper();
  }

  getTitlePanel(): Panel { return this.#pTitle; }
  getDescriptionPanel(): Panel { return this.#pDescription; }
  getChoicesPanel(): ListPanel { return this.#pChoices; }
  getAlternativesPanel(): ListPanel { return this.#pAlternatives; }
  getBtnCancelPanel(): PanelWrapper { return this.#btnCancel; }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pDescription.attach(this._getSubElementId("D"));
    this.#pChoices.attach(this._getSubElementId("C"));
    this.#pAlternatives.attach(this._getSubElementId("A"));
    this.#btnCancel.attach(this._getSubElementId("B"));
  }

  _renderFramework(): string {
    let s: string = _CLT_MULTI_CHOICE.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T")) as string;
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D")) as string;
    s = s.replace("__ID_CHOICES__", this._getSubElementId("C")) as string;
    s = s.replace("__ID_ALTERNATIVES__", this._getSubElementId("A")) as string;
    s = s.replace("__ID_BTN_CANCEL__", this._getSubElementId("B")) as string;
    return s;
  }
}

const _CL_CONTEXT = {
  TITLE : `__TITLE__:`,
} as const;

interface LMultiChoiceDelegate {
  onAlternativeChosenInMultiChoiceLayer(l: LMultiChoice, value: unknown): void;
  onItemsChosenInMultiChoiceLayer(l: LMultiChoice, values: unknown[]): void;
}

export class LMultiChoice extends Layer {
  #title: string | null = null;
  #description: string | null = null;
  #fChoices: FFragmentList;
  #fAlternatives: FFragmentList;
  #btnCancel: Button;

  protected declare _delegate: LMultiChoiceDelegate;

  constructor() {
    super();
    this.#fChoices = new FFragmentList();
    this.setChild("choices", this.#fChoices);

    this.#fAlternatives = new FFragmentList();
    this.setChild("alternatives", this.#fAlternatives);

    this.#btnCancel = new Button();
    this.#btnCancel.setThemeType(Button.T_THEME.PALE);
    this.#btnCancel.setName("Cancel");
    this.#btnCancel.setDelegate(this);
    this.setChild("btnCancel", this.#btnCancel);
  }

  setTargetName(name: string): void {
    if (name && name.length) {
      this.#title = "Choose " + name;
    } else {
      this.#title = null;
    }
  }
  setDescription(d: string): void { this.#description = d; }

  addChoice(name: string, value: unknown, icon: string | null = null, themeType: unknown = null, isEnabled: boolean = true): void {
    let f = new Button();
    f.setName(name);
    f.setIcon(icon);
    f.setEnabled(isEnabled);
    f.setValue(value);
    f.setThemeType(themeType as symbol | null);
    f.setDelegate(this);
    this.#fChoices.append(f);
  }

  addAlternative(name: string, value: unknown, icon: string | null = null, themeType: unknown = null, isEnabled: boolean = true): void {
    let f = new Button();
    f.setName(name);
    f.setIcon(icon);
    f.setEnabled(isEnabled);
    f.setValue(value);
    f.setThemeType(themeType as symbol | null);
    f.setDelegate(this);
    this.#fAlternatives.append(f);
  }

  // These are hacks, should have more generic structure for fragment protocols
  onRemoteErrorInFragment(_f: any, e: unknown): void {
    console.log("onRemoteErrorInFragment not implemented in LMultiChoice");
    console.log(e);
  }
  onLocalErrorInFragment(_f: any, msg: string): void {
    console.log("onLocalErrorInFragment not implemented in LMultiChoice");
    console.log(msg);
  }
  onFragmentRequestShowView(_f: any, _view: View, _title: string): void {
    console.log("onFragmentRequestShowView not implemented in LMultiChoice");
  }

  clearItems(): void {
    this.#fChoices.clear();
    this.#fAlternatives.clear();
  }

  dismiss(): void {
    if (this._owner) {
      (this._owner as any).onRequestPopLayer(this);
    }
  }

  onSimpleButtonClicked(fBtn: Button): void {
    this.#onClose();
    if (fBtn != this.#btnCancel) {
      if (typeof (fBtn as any).isOwnedBy === 'function' && (fBtn as any).isOwnedBy(this.#fAlternatives)) {
        this._delegate.onAlternativeChosenInMultiChoiceLayer(this,
                                                             fBtn.getValue());
      } else {
        // TODO: Use boxes before choices
        this._delegate.onItemsChosenInMultiChoiceLayer(this,
                                                       [ fBtn.getValue() ]);
      }
    }
  }

  _renderOnRender(render: any): void {
    // Animate when render for the first time, this might be a hack
    let shouldAnimate = !(render as any).getContentPanel();

    let panel = new PanelWrapper();
    panel.setClassName("w100 h100 context-layer flex flex-column flex-end");
    panel.setAttribute("onclick",
                       "javascript:G.action(window.CL_MULTI_CHOICE.CLOSE)");
    render.wrapPanel(panel);

    let p = new PanelWrapper();
    p.setClassName("w100 flex flex-center relative");
    panel.wrapPanel(p);

    let pMultiChoiceLayer = new PMultiChoiceLayer();
    pMultiChoiceLayer.setClassName(
        "w100 s-csecondarybg bdlightgray border-box context-content");
    pMultiChoiceLayer.setAttribute("onclick", "javascript:G.anchorClick()");
    p.wrapPanel(pMultiChoiceLayer);

    let pTitle = pMultiChoiceLayer.getTitlePanel();
    pTitle.replaceContent(this.#renderTitle(this.#title));

    if (this.#description) {
      let pDescription = pMultiChoiceLayer.getDescriptionPanel();
      pDescription.replaceContent(this.#description);
    }

    let pChoices = pMultiChoiceLayer.getChoicesPanel();
    // Hack to allow events being recognized in this.#fChoices
    this.#fChoices.attachRender(pChoices);

    for (let f of this.#fChoices.getChildren()) {
      let pp = new PanelWrapper();
      pChoices.pushPanel(pp);
      f.attachRender(pp);
      f.render();
      pChoices.pushSpace(1);
    }

    let pAlternatives = pMultiChoiceLayer.getAlternativesPanel();
    // Hack to allow events being recognized in this.#fAlternatives
    this.#fAlternatives.attachRender(pAlternatives);

    for (let f of this.#fAlternatives.getChildren()) {
      let pp = new PanelWrapper();
      pAlternatives.pushPanel(pp);
      f.attachRender(pp);
      f.render();
      pAlternatives.pushSpace(1);
    }

    let pBtnCancel = pMultiChoiceLayer.getBtnCancelPanel();
    this.#btnCancel.attachRender(pBtnCancel);
    this.#btnCancel.render();

    if (shouldAnimate) {
      pMultiChoiceLayer.animate([ {bottom : `-${pMultiChoiceLayer.getHeight()}px`}, {bottom : "0px"} ],
                    {duration : 200, easing : "ease-out" });
    }
  }

  action(type: symbol, ..._args: unknown[]): void {
    switch (type) {
    case CL_MULTI_CHOICE.CLOSE:
      this.#onClose();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  popState(_state: any): void {}

  #renderTitle(title: string | null): string {
    let s: string = _CL_CONTEXT.TITLE;
    if (title && title.length) {
      s = s.replace("__TITLE__", title) as string;
    } else {
      s = s.replace("__TITLE__", "Choices") as string;
    }
    return s;
  }
  #onClose(): void { this.dismiss(); }
}

// Export to window for string template access
if (typeof window !== 'undefined') {
  (window as any).CL_MULTI_CHOICE = CL_MULTI_CHOICE;
}

