import { Panel } from '../../renders/panels/Panel.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { Fragment } from './Fragment.js';
import { Button } from './Button.js';

export const CF_MONTH_SELECTOR = {
  Y_CHOOSE : Symbol(),
  M_CHOOSE : Symbol(),
};

const _CPT_MONTH_SELECTOR = {
  MAIN : `<div class="pad5px flex flex-start">
    <div id="__ID_YEAR__" class="w50 hmax100px y-scroll no-scrollbar"></div>
    <div id="__ID_MONTH__" class="w50 hmax100px y-scroll no-scrollbar"></div>
  </div>
  <div id="__ID_BTN_OK__"></div>`,
};

class PMonthSelector extends Panel {
  #pYear;
  #pMonth;
  #pBtnOk;

  constructor() {
    super();
    this.#pYear = new ListPanel();
    this.#pMonth = new ListPanel();
    this.#pBtnOk = new PanelWrapper();
  }

  getYearPanel() { return this.#pYear; }
  getMonthPanel() { return this.#pMonth; }
  getBtnOkPanel() { return this.#pBtnOk; }

  _renderFramework() {
    let s = _CPT_MONTH_SELECTOR.MAIN;
    s = s.replace("__ID_YEAR__", this._getSubElementId("Y"));
    s = s.replace("__ID_MONTH__", this._getSubElementId("M"));
    s = s.replace("__ID_BTN_OK__", this._getSubElementId("B"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pYear.attach(this._getSubElementId("Y"));
    this.#pMonth.attach(this._getSubElementId("M"));
    this.#pBtnOk.attach(this._getSubElementId("B"));
  }
};

export class FMonthSelector extends Fragment {
  #date;
  #btnOk;

  constructor() {
    super();
    this.#date = new Date();

    this.#btnOk = new Button();
    this.#btnOk.setName("Ok");
    this.#btnOk.setDelegate(this);
    this.setChild("btnOk", this.#btnOk);
  }

  setData(y, m) {
    this.#date.setFullYear(y);
    this.#date.setMonth(m);
  }

  onSimpleButtonClicked(fBtn) {
    this._delegate.onMonthSelectedInMonthSelector(
        this, this.#date.getFullYear(), this.#date.getMonth());
  }

  action(type, ...args) {
    switch (type) {
    case CF_MONTH_SELECTOR.Y_CHOOSE:
      this.#onChooseYear(args[0]);
      break;
    case CF_MONTH_SELECTOR.M_CHOOSE:
      this.#onChooseMonth(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let panel = new PMonthSelector();
    render.wrapPanel(panel);

    let y = this.#date.getFullYear();
    let m = this.#date.getMonth();

    let p = panel.getYearPanel();
    let pp, pCurrent;
    let baseNames = [ "pad5px", "clickable" ];
    let names;
    for (let i = -20; i < 20; ++i) {
      let yy = y + i;
      pp = new Panel();
      pp.setAttribute(
          "onclick",
          `javascript:G.action(ui.CF_MONTH_SELECTOR.Y_CHOOSE, ${yy})`);
      if (i == 0) {
        names = baseNames.concat([ "s-cfuncbg", "s-csecondary", "bold" ]);
        pCurrent = pp;
      } else {
        names = baseNames;
      }
      pp.setClassName(names.join(" "));
      p.pushPanel(pp);
      pp.replaceContent(yy);
    }
    let dy = pCurrent.getTop() - pCurrent.getHeight() * 3;
    if (dy > 0) {
      p.scrollTo(0, dy);
    }

    p = panel.getMonthPanel();
    for (let i = 0; i < 12; ++i) {
      pp = new Panel();

      pp.setAttribute(
          "onclick",
          `javascript:G.action(ui.CF_MONTH_SELECTOR.M_CHOOSE, ${i})`);
      if (i == m) {
        names = baseNames.concat([ "s-cfuncbg", "s-csecondary", "bold" ]);
        pCurrent = pp;
      } else {
        names = baseNames;
      }
      pp.setClassName(names.join(" "));
      p.pushPanel(pp);
      let mm = i + 1;
      pp.replaceContent(mm < 10 ? "0" + mm : mm);
    }
    dy = pCurrent.getTop() - pCurrent.getHeight() * 3;
    if (dy > 0) {
      p.scrollTo(0, dy);
    }

    p = panel.getBtnOkPanel();
    this.#btnOk.attachRender(p);
    this.#btnOk.render();
  }

  #onChooseYear(v) {
    this.#date.setFullYear(v);
    this.render();
  }

  #onChooseMonth(v) {
    this.#date.setMonth(v);
    this.render();
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.CF_MONTH_SELECTOR = CF_MONTH_SELECTOR;
  window.ui.FMonthSelector = FMonthSelector;
}
