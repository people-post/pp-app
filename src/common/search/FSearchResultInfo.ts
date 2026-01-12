export const CF_SEARCH_RESULT_INFO = {
  ON_CLICK : "CF_SEARCH_RESULT_INFO_1",
} as const;

const _CPT_SEARCH_RESULT_INFO = {
  TITLE_ONLY_MAIN : `<div class="search-result-info pad5px clickable">
  <div id="__ID_TITLE__"></div>
  </div>`,
  BRIEF_MAIN : `<div class="info-panel brief clickable">
  <div class="pad10px u-font2 line-height32">
    <div id="__ID_CONTENT__"></div>
  </div>
  <div id="__ID_TIME__" class="small-info-text"></div>
  </div>`,
  NORMAL_MAIN : `<div class="search-result-info pad10px clickable">
  <div>
    <span class="u-font3 s-cfunc">
      <span id="__ID_ICON__" class="inline-block s-icon6"></span>
      <span id="__ID_TITLE__"></span>
    </span>
  </div>
  <div id="__ID_CONTENT__" class="u-font4 cdimgray hmax80px hide-overflow"></div>
  <div id="__ID_TIME__" class="small-info-text"></div>
  </div>`,
  KEYWORD : `<span class="search-result-match">__KEYWORD__</span>`,
};

import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { Utilities } from '../Utilities.js';

interface MatchInfoElement {
  prefix?: string;
  is_prefix_overflow?: boolean;
  keyword?: string;
  postfix?: string;
  is_postfix_overflow?: boolean;
}

interface MatchInfo {
  elements: MatchInfoElement[];
}

interface SearchResultData {
  type: string | symbol;
  id: string;
  title: MatchInfo;
  content: MatchInfo;
  timestamp?: number;
}

export class PSearchResultInfo extends Panel {
  getTimePanel(): Panel | null { return null; }
  getIconPanel(): Panel | null { return null; }
  getTitlePanel(): Panel | null { return null; }
  getContentPanel(): Panel | null { return null; }
}

export class PSearchResultInfoTitleOnly extends PSearchResultInfo {
  #pTitle: Panel;

  constructor() {
    super();
    this.#pTitle = new Panel();
  }

  getTitlePanel(): Panel { return this.#pTitle; }

  _renderFramework(): string {
    let s = _CPT_SEARCH_RESULT_INFO.TITLE_ONLY_MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
  }
}

export class PSearchResultInfoBrief extends PSearchResultInfo {
  #pContent: Panel;
  #pTime: Panel;

  constructor() {
    super();
    this.#pContent = new Panel();
    this.#pTime = new Panel();
  }

  getContentPanel(): Panel { return this.#pContent; }
  getTimePanel(): Panel { return this.#pTime; }

  _renderFramework(): string {
    let s = _CPT_SEARCH_RESULT_INFO.BRIEF_MAIN;
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_TIME__", this._getSubElementId("T"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pTime.attach(this._getSubElementId("T"));
  }
}

export class PSearchResultInfoNormal extends PSearchResultInfo {
  #pIcon: Panel;
  #pTitle: Panel;
  #pContent: Panel;
  #pTime: Panel;

  constructor() {
    super();
    this.#pIcon = new Panel();
    this.#pTitle = new Panel();
    this.#pContent = new Panel();
    this.#pTime = new Panel();
  }

  getIconPanel(): Panel { return this.#pIcon; }
  getTitlePanel(): Panel { return this.#pTitle; }
  getContentPanel(): Panel { return this.#pContent; }
  getTimePanel(): Panel { return this.#pTime; }

  _renderFramework(): string {
    let s = _CPT_SEARCH_RESULT_INFO.NORMAL_MAIN;
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pIcon.attach(this._getSubElementId("I"));
    this.#pTitle.attach(this._getSubElementId("TT"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pTime.attach(this._getSubElementId("TM"));
  }
}

interface FSearchResultInfoDelegate {
  onClickInSearchResultInfoFragment(f: FSearchResultInfo, itemType: string | symbol, itemId: string): void;
}

export class FSearchResultInfo extends Fragment {
  static T_LAYOUT = {
    BRIEF : Symbol(),
    TITLE_ONLY: Symbol(),
  };

  #data: SearchResultData | null = null;
  #tLayout: symbol | null = null;
  protected _delegate!: FSearchResultInfoDelegate;

  setData(data: SearchResultData): void { this.#data = data; }
  setLayoutType(t: symbol | null): void { this.#tLayout = t; }

  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CF_SEARCH_RESULT_INFO.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: any): void {
    if (!this.#data) {
      return;
    }

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    this.#renderIcon(panel.getIconPanel(), this.#data.type);
    this.#renderTitle(panel.getTitlePanel(), this.#data.title);
    this.#renderContent(panel.getContentPanel(), this.#data.content);
    this.#renderTime(panel.getTimePanel(), this.#data.timestamp);
  }

  #createPanel(): PSearchResultInfo {
    let p: PSearchResultInfo;
    switch (this.#tLayout) {
    case FSearchResultInfo.T_LAYOUT.TITLE_ONLY:
      p = new PSearchResultInfoTitleOnly();
      break;
    case FSearchResultInfo.T_LAYOUT.BRIEF:
      p = new PSearchResultInfoBrief();
      break;
    default:
      p = new PSearchResultInfoNormal();
      break;
    }
    p.setAttribute("onclick",
                   `javascript:G.action("${CF_SEARCH_RESULT_INFO.ON_CLICK}")`);
    return p;
  }

  #renderTitle(panel: Panel | null, matchInfo: MatchInfo): void {
    if (!panel) {
      return;
    }
    panel.replaceContent(this.#renderMatchInfoElements(matchInfo.elements));
  }

  #renderContent(panel: Panel | null, matchInfo: MatchInfo): void {
    if (!panel) {
      return;
    }
    panel.replaceContent(this.#renderMatchInfoElements(matchInfo.elements));
  }

  #renderMatchInfoElements(elements: MatchInfoElement[]): string {
    let items: string[] = [];
    for (let e of elements) {
      items.push(this.#renderMatchInfoElement(e));
    }
    return items.join("...");
  }

  #renderMatchInfoElement(e: MatchInfoElement): string {
    let s = "";
    if (e.prefix) {
      if (e.is_prefix_overflow) {
        s += "...";
      }
      s += e.prefix;
    }

    let t = _CPT_SEARCH_RESULT_INFO.KEYWORD;
    s += t.replace("__KEYWORD__", e.keyword ? e.keyword : "");

    if (e.postfix) {
      s += e.postfix;
      if (e.is_postfix_overflow) {
        s += "...";
      }
    }
    return s;
  }

  #renderIcon(panel: Panel | null, type: string | symbol): void {
    if (!panel) {
      return;
    }
    let icon = SocialItem.getIcon(type);
    panel.replaceContent(Utilities.renderSvgFuncIcon(icon));
  }

  #renderTime(panel: Panel | null, timestamp?: number): void {
    if (!panel) {
      return;
    }
    if (timestamp) {
      panel.replaceContent(
          Utilities.renderSmartTime(new Date(timestamp * 1000)));
    }
  }

  #onClick(): void {
    if (this.#data) {
      this._delegate.onClickInSearchResultInfoFragment(this, this.#data.type,
                                                       this.#data.id);
    }
  }
}
