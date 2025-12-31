import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { MenuContent } from './MenuContent.js';
import { SearchBar } from '../gui/SearchBar.js';
import { FDateTimeSelector } from '../../lib/ui/controllers/fragments/FDateTimeSelector.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Factory, T_CATEGORY, T_OBJ } from '../../lib/framework/Factory.js';
import { View } from '../../lib/ui/controllers/views/View.js';

const _CPT_DATE_FILTER = {
  MAIN :
      `<div class="menu-hr-wrapper"><span class="menu-hr s-cmenubg"></span></div>
  <div id="__ID_SEARCH_BAR__"></div>
  <div class="separator s-cmenubd">Or</div>
  <div class="flex space-around">
    <div id="__ID_FROM__"></div>
    <div id="__ID_TO__"></div>
  </div>
  <br>
  <div id="__ID_BTN_APPLY__"></div>
  <br>`,
};

export class PDateFilter extends Panel {
  #pSearchBar;
  #pFrom;
  #pTo;
  #btnApply;

  constructor() {
    super();
    this.#pSearchBar = new PanelWrapper();
    this.#pFrom = new PanelWrapper();
    this.#pTo = new PanelWrapper();
    this.#btnApply = new PanelWrapper();
  }

  getSearchBarPanel() { return this.#pSearchBar; }
  getFromTimePanel() { return this.#pFrom; }
  getToTimePanel() { return this.#pTo; }
  getBtnApplyPanel() { return this.#btnApply; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pSearchBar.attach(this._getSubElementId("S"));
    this.#pFrom.attach(this._getSubElementId("F"));
    this.#pTo.attach(this._getSubElementId("T"));
    this.#btnApply.attach(this._getSubElementId("B"));
  }

  _renderFramework() {
    let s = _CPT_DATE_FILTER.MAIN;
    s = s.replace("__ID_SEARCH_BAR__", this._getSubElementId("S"));
    s = s.replace("__ID_FROM__", this._getSubElementId("F"));
    s = s.replace("__ID_TO__", this._getSubElementId("T"));
    s = s.replace("__ID_BTN_APPLY__", this._getSubElementId("B"));
    return s;
  }
};

export class MCDateFilter extends MenuContent {
  #fBar;
  #fFrom;
  #fTo;
  #btnApply;

  constructor() {
    super();
    this.#fBar = new SearchBar();
    this.#fBar.setFatMode(true);
    this.#fBar.setDelegate(this);
    this.setChild("searchbar", this.#fBar);

    this.#fFrom = new FDateTimeSelector();
    this.#fFrom.setEnableTime(false);
    this.#fFrom.setHintText("From date...");
    this.#fFrom.setDelegate(this);
    this.setChild("from", this.#fFrom);

    this.#fTo = new FDateTimeSelector();
    this.#fTo.setEnableTime(false);
    this.#fTo.setHintText("To date...");
    this.#fTo.setDelegate(this);
    this.setChild("to", this.#fTo);

    this.#btnApply = new Button();
    this.#btnApply.setName("Apply");
    this.#btnApply.setDelegate(this);
    this.setChild("btnApply", this.#btnApply);
  }

  setTimeRange(tFrom, tTo) {
    this.#fFrom.setDateTime(tFrom ? tFrom.getTime() / 1000 : null);
    this.#fTo.setDateTime(tTo ? tTo.getTime() / 1000 : null);
  }

  onSimpleButtonClicked(fBtn) { this.#onApply(); }

  onGuiSearchBarRequestSearch(fSearchBar, value) {
    this._delegate.onMenuFragmentRequestCloseMenu(this);
    let cls = Factory.getClass(
        T_CATEGORY.UI, T_OBJ.SEARCH_RESULT_VIEW_CONTENT_FRAGMENT);
    let f = new cls();
    f.setKey(value);
    let v = new View();
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Search result");
  }

  _renderOnRender(render) {
    if (this._isQuickLinkRenderMode) {
      this.#renderQuickLink(render);
    } else {
      this.#renderDropDown(render);
    }
  }

  #renderQuickLink(render) {
    this.#fBar.attachRender(render);
    this.#fBar.render();
  }

  #renderDropDown(render) {
    let panel = new PDateFilter();
    render.wrapPanel(panel);

    let p = panel.getSearchBarPanel();
    this.#fBar.attachRender(p);
    this.#fBar.render();

    p = panel.getFromTimePanel();
    this.#fFrom.attachRender(p);
    this.#fFrom.render();

    p = panel.getToTimePanel();
    this.#fTo.attachRender(p);
    this.#fTo.render();

    p = panel.getBtnApplyPanel();
    this.#btnApply.attachRender(p);
    this.#btnApply.render();
  }

  #onApply() {
    let tFrom = this.#fFrom.getValue();
    let tTo = this.#fTo.getValue();
    this._delegate.onTimeRangeSelectedInDateTimeFilterFragment(this, tFrom,
                                                               tTo);
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
}
