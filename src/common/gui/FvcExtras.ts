import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleList, SimpleListDataSource, SimpleListDelegate } from './FSimpleList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { WebConfig } from '../dba/WebConfig.js';
import { RemoteError } from '../datatypes/RemoteError.js';
import { URL_PARAM } from '../constants/Constants.js';
import { R } from '../constants/R.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import type { PageConfig } from '../../lib/ui/controllers/PageConfig.js';

export const CF_EXTRAS_CONTENT = {
  TEST : "CF_EXTRAS_CONTENT_1",
}

const _CFT_EXTRAS_CONTENT = {
  BADGE : `<span class="inline-notification-badge">__BADGE__</span>`,
  BTN_TEST :
      `<a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action('${CF_EXTRAS_CONTENT.TEST}')">Test</a>`,
}

interface ListItem {
  pageId: string;
  pageIcon: string | null;
  data: {
    page: PageConfig;
    nNotifications: number;
  };
  selectable: boolean;
}

export interface FvcExtrasDataSource {
  getPageConfigsForExtrasViewContentFragment(f: FvcExtras): PageConfig[];
  getNPageNotificationsForExtrasViewContentFragment(f: FvcExtras, id: string): number;
  createPageEntryViewForExtrasViewContentFragment(f: FvcExtras, pageId: string | null): View | null;
}

export class FvcExtras extends FScrollViewContent implements SimpleListDataSource<ListItem>, SimpleListDelegate<ListItem> {
  _fMenu: FSimpleList<ListItem>;
  _subPageId: string | null = null;

  constructor() {
    super();
    this._fMenu = new FSimpleList<ListItem>();
    this._fMenu.setDataSource(this);
    this._fMenu.setDelegate(this);
    this._fMenu.setRules({
      getId: item => item.pageId,
      getIcon: item => item.pageIcon,
      isSelectable: item => item.selectable,
    });
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

  getListItemsForListFragment(_fList: FSimpleList<ListItem>): ListItem[] { return this.#getListItems(); }
  getSelectedItemIdForList(_fList: FSimpleList<ListItem>): string | null { return this._subPageId; }

  onItemSelectedInList(_fList: FSimpleList<ListItem>, itemId: string): void { this.#onSubPageSelected(itemId); }

  renderItemForSimpleListFragment(_fSimpleList: FSimpleList<ListItem>, item: ListItem, panel: Panel): void {
    const config = item.data;
    panel.replaceContent(
        this.#renderTitle(R.t(config.page.NAME), config.nNotifications));
  }

  action(type: symbol | string, ...args: unknown[]): void {
    switch (type) {
    case CF_EXTRAS_CONTENT.TEST:
      this.#onTest();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case PltT_DATA.USER_PROFILE:
    case FwkT_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: PanelWrapper): void {
    const p = new ListPanel();
    render.wrapPanel(p);

    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fMenu.attachRender(pp);
    this._fMenu.render();

    if (WebConfig.isDevSite()) {
      const pTest = new Panel();
      p.pushPanel(pTest);
      pTest.replaceContent(this.#renderTest());
    }
  }

  #getListItems(): ListItem[] {
    const dataSource = this.getDataSource<FvcExtrasDataSource>();
    const configs = dataSource
      ? dataSource.getPageConfigsForExtrasViewContentFragment(this)
      : [];
    const items: ListItem[] = [];
    for (const c of configs) {
      items.push({
        pageId : c.ID,
        pageIcon : c.ICON,
        data : {
          page : c,
          nNotifications : dataSource
              ? dataSource.getNPageNotificationsForExtrasViewContentFragment(
                    this, c.ID)
              : 0
        },
        selectable : true,
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
    const dataSource = this.getDataSource<FvcExtrasDataSource>();
    const v = dataSource
      ? dataSource.createPageEntryViewForExtrasViewContentFragment(this, pageId)
      : null;
    if (v && this._owner) {
      (this._owner as any).onFragmentRequestShowView(this, v, pageId || "");
      if (urlParam) {
        const urlParams = new URLSearchParams();
        for (const [key, value] of urlParam) {
          urlParams.set(key, value);
        }
        v.initFromUrl(urlParams);
      }
    }
  }

  #onTest(): void {
    const e: RemoteError = {
      type: RemoteError.T_TYPE.QUOTA,
      code: "Q_LIVE_STREAM",
      data: {period : 1000, quota : 3, fallback_period : 1000}
    } as RemoteError;
    if (this._owner) {
      (this._owner as any).onRemoteErrorInFragment(this, e);
    }
    //  fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, e);
  }
}

