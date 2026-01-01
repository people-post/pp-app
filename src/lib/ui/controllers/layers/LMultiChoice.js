import { Panel } from '../../renders/panels/Panel.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { Layer } from './Layer.js';
import { FFragmentList } from '../fragments/FFragmentList.js';
import { Button } from '../fragments/Button.js';

export const CL_MULTI_CHOICE = {
  CLOSE : Symbol(),
};

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
};

class PContextLayer extends Panel {
  #pTitle;
  #pDescription;
  #pChoices;
  #pAlternatives;
  #btnCancel;

  constructor() {
    super();
    this.#pTitle = new Panel();
    this.#pDescription = new Panel();
    this.#pChoices = new ListPanel();
    this.#pAlternatives = new ListPanel();
    this.#btnCancel = new PanelWrapper();
  }

  getTitlePanel() { return this.#pTitle; }
  getDescriptionPanel() { return this.#pDescription; }
  getChoicesPanel() { return this.#pChoices; }
  getAlternativesPanel() { return this.#pAlternatives; }
  getBtnCancelPanel() { return this.#btnCancel; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pDescription.attach(this._getSubElementId("D"));
    this.#pChoices.attach(this._getSubElementId("C"));
    this.#pAlternatives.attach(this._getSubElementId("A"));
    this.#btnCancel.attach(this._getSubElementId("B"));
  }

  _renderFramework() {
    let s = _CLT_MULTI_CHOICE.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_CHOICES__", this._getSubElementId("C"));
    s = s.replace("__ID_ALTERNATIVES__", this._getSubElementId("A"));
    s = s.replace("__ID_BTN_CANCEL__", this._getSubElementId("B"));
    return s;
  }
};

const _CL_CONTEXT = {
  TITLE : `__TITLE__:`,
};

export class LMultiChoice extends Layer {
  #title = null;
  #description = null;
  #fChoices;
  #fAlternatives;
  #btnCancel;

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

  setTargetName(name) {
    if (name && name.length) {
      this.#title = "Choose " + name;
    } else {
      this.#title = null;
    }
  }
  setDescription(d) { this.#description = d; }

  addChoice(name, value, icon = null, themeType = null, isEnabled = true) {
    let f = new Button();
    f.setName(name);
    f.setIcon(icon);
    f.setEnabled(isEnabled);
    f.setValue(value);
    f.setThemeType(themeType);
    f.setDelegate(this);
    this.#fChoices.append(f);
  }

  addAlternative(name, value, icon = null, themeType = null, isEnabled = true) {
    let f = new Button();
    f.setName(name);
    f.setIcon(icon);
    f.setEnabled(isEnabled);
    f.setValue(value);
    f.setThemeType(themeType);
    f.setDelegate(this);
    this.#fAlternatives.append(f);
  }

  // These are hacks, should have more generic structure for fragment protocols
  onRemoteErrorInFragment(f, e) {
    console.log("onRemoteErrorInFragment not implemented in LMultiChoice");
    console.log(e);
  }
  onLocalErrorInFragment(f, msg) {
    console.log("onLocalErrorInFragment not implemented in LMultiChoice");
    console.log(msg);
  }
  onFragmentRequestShowView(f, view, title) {
    console.log("onFragmentRequestShowView not implemented in LMultiChoice");
  }

  clearItems() {
    this.#fChoices.clear();
    this.#fAlternatives.clear();
  }

  dismiss() {
    if (this._owner) {
      this._owner.onRequestPopLayer(this);
    }
  }

  onSimpleButtonClicked(fBtn) {
    this.#onClose();
    if (fBtn != this.#btnCancel) {
      if (fBtn.isOwnedBy(this.#fAlternatives)) {
        this._delegate.onAlternativeChosenInMultiChoiceLayer(this,
                                                             fBtn.getValue());
      } else {
        // TODO: Use boxes before choices
        this._delegate.onItemsChosenInMultiChoiceLayer(this,
                                                       [ fBtn.getValue() ]);
      }
    }
  }

  _renderOnRender(render) {
    // Animate when render for the first time, this might be a hack
    let shouldAnimate = !render.getContentPanel();

    let panel = new PanelWrapper();
    panel.setClassName("w100 h100 context-layer flex flex-column flex-end");
    panel.setAttribute("onclick",
                       "javascript:G.action(window.CL_MULTI_CHOICE.CLOSE)");
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

    p = panel.getChoicesPanel();
    // Hack to allow events being recognized in this.#fChoices
    this.#fChoices.attachRender(p);

    for (let f of this.#fChoices.getChildren()) {
      let pp = new PanelWrapper();
      p.pushPanel(pp);
      f.attachRender(pp);
      f.render();
      p.pushSpace(1);
    }

    p = panel.getAlternativesPanel();
    // Hack to allow events being recognized in this.#fAlternatives
    this.#fAlternatives.attachRender(p);

    for (let f of this.#fAlternatives.getChildren()) {
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

  action(type, ...args) {
    switch (type) {
    case CL_MULTI_CHOICE.CLOSE:
      this.#onClose();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  popState(state) {}

  #renderTitle(title) {
    let s = _CL_CONTEXT.TITLE;
    if (title && title.length) {
      s = s.replace("__TITLE__", title);
    } else {
      s = s.replace("__TITLE__", "Choices");
    }
    return s;
  }
  #onClose() { this.dismiss(); }
}
