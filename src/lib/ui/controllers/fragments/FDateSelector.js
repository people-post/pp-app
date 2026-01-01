import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Fragment } from './Fragment.js';
import { LContext } from '../layers/LContext.js';
import { FMonthSelector } from './FMonthSelector.js';
import { Button } from './Button.js';
import { ICON } from '../../../../common/constants/Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';
import { T_ACTION } from '../../../framework/Events.js';
import { Events } from '../../../framework/Events.js';

export const CF_DATE_SELECTOR = {
  TODAY : Symbol(),
  D_CHOOSE : Symbol(),
  M_CHOOSE : Symbol(),
  PREV : Symbol(),
  NEXT : Symbol(),
};

const _CPT_DATE_SELECTOR = {
  MAIN : `<div class="v-pad5px flex space-between">
    <div id="__ID_MONTH__" class="s-font2 bold clickable"></div>
    <div id="__ID_BTN_TODAY__" class="clickable no-wrap"></div>
    <div class="flex flex-start">
      <div id="__ID_BTN_PREV__" class="clickable s-icon5"></div>
      <div id="__ID_BTN_NEXT__" class="clickable s-icon5"></div>
    </div>
  </div>
  <div id="__ID_DATES__" class="grid grid7col center-align-items center-justify-items"></div>
  <div id="__ID_ACTIONS__"></div>`,
};

class PDateSelector extends Panel {
  #pMonth;
  #pBtnToday;
  #pPrev;
  #pNext;
  #pDates;
  #pActions;

  constructor() {
    super();
    this.#pMonth = new PanelWrapper();
    this.#pBtnToday = new PanelWrapper();
    this.#pPrev = new PanelWrapper();
    this.#pNext = new PanelWrapper();
    this.#pDates = new ListPanel();
    this.#pActions = new ListPanel();
  }

  getMonthPanel() { return this.#pMonth; }
  getBtnTodayPanel() { return this.#pBtnToday; }
  getBtnPrevPanel() { return this.#pPrev; }
  getBtnNextPanel() { return this.#pNext; }
  getDatesPanel() { return this.#pDates; }
  getActionsPanel() { return this.#pActions; }

  _renderFramework() {
    let s = _CPT_DATE_SELECTOR.MAIN;
    s = s.replace("__ID_MONTH__", this._getSubElementId("M"));
    s = s.replace("__ID_BTN_TODAY__", this._getSubElementId("T"));
    s = s.replace("__ID_BTN_PREV__", this._getSubElementId("P"));
    s = s.replace("__ID_BTN_NEXT__", this._getSubElementId("N"));
    s = s.replace("__ID_DATES__", this._getSubElementId("D"));
    s = s.replace("__ID_ACTIONS__", this._getSubElementId("A"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pMonth.attach(this._getSubElementId("M"));
    this.#pBtnToday.attach(this._getSubElementId("T"));
    this.#pPrev.attach(this._getSubElementId("P"));
    this.#pNext.attach(this._getSubElementId("N"));
    this.#pDates.attach(this._getSubElementId("D"));
    this.#pActions.attach(this._getSubElementId("A"));
  }
};

export class FDateSelector extends Fragment {
  #lc;
  #fMonth;
  #btnClear;
  #date;
  #isClearBtnEnabled = true;

  constructor() {
    super();
    this.#date = new Date();

    this.#lc = new LContext();
    this.#lc.setDelegate(this);
    this.#lc.setTargetName("month");

    this.#fMonth = new FMonthSelector();
    this.#fMonth.setDelegate(this);
    this.setChild("month", this.#fMonth);

    this.#btnClear = new Button();
    this.#btnClear.setName("Clear");
    this.#btnClear.setValue("CLEAR");
    this.#btnClear.setDelegate(this);
    this.setChild("btnClear", this.#btnClear);
  }

  setDate(y, m, d) {
    this.#date.setFullYear(y);
    this.#date.setMonth(m);
    this.#date.setDate(d);
  }

  setEnableClear(b) { this.#isClearBtnEnabled = b; }

  onSimpleButtonClicked(fBtn) {
    let v = fBtn.getValue();
    switch (v) {
    case "CLEAR":
      this._delegate.onDateSelectorRequestClearDate(this);
      break;
    default:
      break;
    }
  }

  onMonthSelectedInMonthSelector(fMonthSelector, year, month) {
    this.#lc.dismiss();
    this.#date.setFullYear(year);
    this.#date.setMonth(month);
    this.render();
  }

  action(type, ...args) {
    switch (type) {
    case CF_DATE_SELECTOR.TODAY:
      this.#onToday();
      break;
    case CF_DATE_SELECTOR.D_CHOOSE:
      this.#onChooseDate(args[0]);
      break;
    case CF_DATE_SELECTOR.M_CHOOSE:
      this.#onChooseMonth();
      break;
    case CF_DATE_SELECTOR.PREV:
      this.#onPrevMonth();
      break;
    case CF_DATE_SELECTOR.NEXT:
      this.#onNextMonth();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let panel = new PDateSelector();
    render.wrapPanel(panel);

    let p = panel.getMonthPanel();
    p.setAttribute("onclick",
                   `javascript:G.action(window.CF_DATE_SELECTOR.M_CHOOSE)`);
    p.replaceContent(
        this.#date.toLocaleString([], {month : "2-digit", year : "numeric"}));

    p = panel.getBtnTodayPanel();
    p.setAttribute("onclick", `javascript:G.action(window.CF_DATE_SELECTOR.TODAY)`);
    p.replaceContent("Today");

    p = panel.getBtnPrevPanel();
    p.setAttribute("onclick", `javascript:G.action(window.CF_DATE_SELECTOR.PREV)`);
    // TODO: Fix dependency of downstream utilities
    p.replaceContent(CommonUtilities.renderSvgFuncIcon(ICON.PREV));

    p = panel.getBtnNextPanel();
    p.setAttribute("onclick", `javascript:G.action(window.CF_DATE_SELECTOR.NEXT)`);
    // TODO: Fix dependency of downstream utilities
    p.replaceContent(CommonUtilities.renderSvgFuncIcon(ICON.NEXT));

    //  this.#fYear.setConfig({min : 0, max : y + 30, step : 1, value :
    //  y}); this.#fYear.attachRender(p); this.#fYear.render();

    let pList = panel.getDatesPanel();

    for (let t of ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]) {
      p = new Panel();
      p.setClassName("s-font5 bold");
      pList.pushPanel(p);
      p.replaceContent(t);
    }

    let y = this.#date.getFullYear();
    let m = this.#date.getMonth();
    let offset = new Date(y, m, 1).getDay();
    let current = this.#date.getDate();
    let nLast = new Date(y, m, 0).getDate();
    let n = new Date(y, m + 1, 0).getDate();
    let total = 42; // 6 * 7;
    for (let i = 0; i < total; ++i) {
      p = new PanelWrapper();
      let d = i - offset + 1;
      if (d > 0 && d <= n) {
        let names = [
          "w100", "center-align", "v-pad5px", "no-wrap", "clickable", "s-font5"
        ];
        if (d == current) {
          names.push("s-cfuncbg");
          names.push("s-csecondary");
        } else {
          names.push("s-cinfotext");
        }
        p.setClassName(names.join(" "));
        p.setAttribute(
            "onclick",
            `javascript:G.action(window.CF_DATE_SELECTOR.D_CHOOSE, ${d})`);
        pList.pushPanel(p);
        p.replaceContent(d);
      } else {
        pList.pushPanel(p);
        p.replaceContent("&nbsp;");
      }
    }

    if (this.#isClearBtnEnabled) {
      pList = panel.getActionsPanel();
      pList.pushSpace(1);
      p = new PanelWrapper();
      pList.pushPanel(p);
      this.#btnClear.attachRender(p);
      this.#btnClear.render();
    }
  }

  #onNextMonth() {
    this.#date.setMonth(this.#date.getMonth() + 1);
    this.render();
  }

  #onPrevMonth() {
    this.#date.setMonth(this.#date.getMonth() - 1);
    this.render();
  }

  #onChooseMonth() {
    this.#lc.clearOptions();
    this.#lc.addOptionFragment(this.#fMonth);
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }

  #onChooseDate(v) {
    this.#date.setDate(v);
    this.render();
    this._delegate.onDateSelectedInDateSelector(this, this.#date);
  }

  #onToday() {
    this.#date = new Date();
    this.render();
  }
};
