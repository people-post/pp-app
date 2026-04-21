import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { MenuContent } from './MenuContent.js';
import { SearchBar } from '../gui/SearchBar.js';
import { FDateTimeSelector } from '../../lib/ui/controllers/fragments/FDateTimeSelector.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Factory, T_OBJ } from '../../lib/framework/Factory.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import type { FSearch } from '../search/FSearch.js';

const _CPT_DATE_FILTER = {
  MAIN :
      `<div class="menu-hr-wrapper"><span class="menu-hr s-cmenubg"></span></div>
  <div id="__ID_SEARCH_BAR__"></div>
  <div class="separator s-cmenubd">Or</div>
  <div class="tw:flex tw:justify-around">
    <div id="__ID_FROM__"></div>
    <div id="__ID_TO__"></div>
  </div>
  <br>
  <div id="__ID_BTN_APPLY__"></div>
  <br>`,
};

export class PDateFilter extends Panel {
  #pSearchBar: PanelWrapper;
  #pFrom: PanelWrapper;
  #pTo: PanelWrapper;
  #btnApply: PanelWrapper;

  constructor() {
    super();
    this.#pSearchBar = new PanelWrapper();
    this.#pFrom = new PanelWrapper();
    this.#pTo = new PanelWrapper();
    this.#btnApply = new PanelWrapper();
  }

  getSearchBarPanel(): PanelWrapper { return this.#pSearchBar; }
  getFromTimePanel(): PanelWrapper { return this.#pFrom; }
  getToTimePanel(): PanelWrapper { return this.#pTo; }
  getBtnApplyPanel(): PanelWrapper { return this.#btnApply; }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pSearchBar.attach(this._getSubElementId("S"));
    this.#pFrom.attach(this._getSubElementId("F"));
    this.#pTo.attach(this._getSubElementId("T"));
    this.#btnApply.attach(this._getSubElementId("B"));
  }

  _renderFramework(): string {
    let s = _CPT_DATE_FILTER.MAIN;
    s = s.replace("__ID_SEARCH_BAR__", this._getSubElementId("S"));
    s = s.replace("__ID_FROM__", this._getSubElementId("F"));
    s = s.replace("__ID_TO__", this._getSubElementId("T"));
    s = s.replace("__ID_BTN_APPLY__", this._getSubElementId("B"));
    return s;
  }
}

export interface MCDateFilterDelegate {
  onMenuFragmentRequestCloseMenu(f: MCDateFilter): void;
  onTimeRangeSelectedInDateTimeFilterFragment(f: MCDateFilter, tFrom: Date | null, tTo: Date | null): void;
}

export class MCDateFilter extends MenuContent {
  #fBar: SearchBar;
  #fFrom: FDateTimeSelector;
  #fTo: FDateTimeSelector;
  #btnApply: Button;

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

  setTimeRange(tFrom: Date | null, tTo: Date | null): void {
    this.#fFrom.setDateTime(tFrom ? tFrom.getTime() / 1000 : null);
    this.#fTo.setDateTime(tTo ? tTo.getTime() / 1000 : null);
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onApply(); }

  onGuiSearchBarRequestSearch(_fSearchBar: SearchBar, value: string): void {
    this.getDelegate<MCDateFilterDelegate>()?.onMenuFragmentRequestCloseMenu(this);
    let cls = Factory.getRequiredCtor<FSearch>(
      T_OBJ.SEARCH_RESULT_VIEW_CONTENT_FRAGMENT);
    let f = new cls();
    f.setKey(value);
    let v = new View();
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Search result");
  }

  _renderOnRender(render: PanelWrapper): void {
    if (this._isQuickLinkRenderMode) {
      this.#renderQuickLink(render);
    } else {
      this.#renderDropDown(render);
    }
  }

  #renderQuickLink(render: PanelWrapper): void {
    this.#fBar.attachRender(render);
    this.#fBar.render();
  }

  #renderDropDown(render: PanelWrapper): void {
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

  #onApply(): void {
    let tFrom = this.#fFrom.getValue();
    let tTo = this.#fTo.getValue();
    this.getDelegate<MCDateFilterDelegate>()?.onTimeRangeSelectedInDateTimeFilterFragment(this, tFrom, tTo);
  }
}

export default MCDateFilter;
