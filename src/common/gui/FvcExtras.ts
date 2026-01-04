import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleList } from './FSimpleList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { T_DATA } from '../../lib/framework/Events.js';
import { WebConfig } from '../dba/WebConfig.js';
import { RemoteError } from '../datatypes/RemoteError.js';
import { URL_PARAM } from '../constants/Constants.js';
import { R } from '../constants/R.js';
import { Render } from '../../lib/ui/renders/Render.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export const CF_EXTRAS_CONTENT = {
  TEST : Symbol(),
}

const _CFT_EXTRAS_CONTENT = {
  BADGE : `<span class="inline-notification-badge">__BADGE__</span>`,
  BTN_TEST :
      `<a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(gui.CF_EXTRAS_CONTENT.TEST)">Test</a>`,
}

interface PageConfig {
  ID: string;
  NAME: string;
  ICON: string;
}

interface ListItem {
  id: string;
  icon: string;
  data: {
    page: PageConfig;
    nNotifications: number;
  };
  isSelectable: boolean;
}

export class FvcExtras extends FScrollViewContent {
  _fMenu: FSimpleList;
  _subPageId: string | null = null;

  constructor() {
    super();
    this._fMenu = new FSimpleList();
    this._fMenu.setDataSource(this);
    this._fMenu.setDelegate(this);
    this.setChild("menu", this._fMenu);
  }

  getUrlParamString(): string {
    if (this._subPageId) {
      return URL_PARAM.PAGE + "=" + this._subPageId;
    } else {
      return "";
    }
  }

  initFromUrl(urlParam: Map<string, string>): void {
    this.#onSubPageSelected(urlParam.get(URL_PARAM.PAGE) || null, urlParam);
  }

  getListItemsForListFragment(fList: FSimpleList): ListItem[] { return this.#getListItems(); }
  getSelectedItemIdForList(fList: FSimpleList): string | null { return this._subPageId; }

  onItemSelectedInList(fList: FSimpleList, itemId: string): void { this.#onSubPageSelected(itemId); }

  renderItemForSimpleListFragment(fSimpleList: FSimpleList, item: ListItem, panel: Panel): void {
    const config = item.data;
    panel.replaceContent(
        this.#renderTitle(R.t(config.page.NAME), config.nNotifications));
  }

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_EXTRAS_CONTENT.TEST:
      this.#onTest();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
    case T_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render: Render): void {
    const p = new ListPanel();
    render.wrapPanel(p);

    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fMenu.attachRender(pp);
    this._fMenu.render();

    if (WebConfig.isDevSite()) {
      pp = new Panel();
      p.pushPanel(pp);
      pp.replaceContent(this.#renderTest());
    }
  }

  #getListItems(): ListItem[] {
    const configs = (this._dataSource as { getPageConfigsForExtrasViewContentFragment(f: FvcExtras): PageConfig[] }).getPageConfigsForExtrasViewContentFragment(this);
    const items: ListItem[] = [];
    for (const c of configs) {
      items.push({
        id : c.ID,
        icon : c.ICON,
        data : {
          page : c,
          nNotifications :
              (this._dataSource as { getNPageNotificationsForExtrasViewContentFragment(f: FvcExtras, id: string): number })
                  .getNPageNotificationsForExtrasViewContentFragment(this, c.ID)
        },
        isSelectable : true,
      });
    }
    return items;
  }

  #renderTitle(name: string, nNotifications: number): string {
    if (nNotifications) {
      return name + " " +
             _CFT_EXTRAS_CONTENT.BADGE.replace("__BADGE__", nNotifications.toString());
    } else {
      return name;
    }
  }

  #renderTest(): string {
    const s = _CFT_EXTRAS_CONTENT.BTN_TEST;
    return s;
  }

  #onSubPageSelected(pageId: string | null, urlParam: Map<string, string> | null = null): void {
    this._subPageId = pageId;
    const v = (this._dataSource as { createPageEntryViewForExtrasViewContentFragment(f: FvcExtras, pageId: string | null): View | null }).createPageEntryViewForExtrasViewContentFragment(
        this, pageId);
    if (v) {
      this._owner.onFragmentRequestShowView(this, v, pageId || "");
      if (urlParam) {
        v.initFromUrl(urlParam);
      }
    }
  }

  #onTest(): void {
    const e: RemoteError = {
      type: RemoteError.T_TYPE.QUOTA,
      code: "Q_LIVE_STREAM",
      data: {period : 1000, quota : 3, fallback_period : 1000}
    } as RemoteError;
    this._owner.onRemoteErrorInFragment(this, e);
    //  fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, e);
  }
}

