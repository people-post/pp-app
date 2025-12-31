import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleList } from './FSimpleList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { T_DATA } from '../../lib/framework/Events.js';
import { WebConfig } from '../dba/WebConfig.js';
import { RemoteError } from '../datatypes/RemoteError.js';

export const CF_EXTRAS_CONTENT = {
  TEST : Symbol(),
}

const _CFT_EXTRAS_CONTENT = {
  BADGE : `<span class="inline-notification-badge">__BADGE__</span>`,
  BTN_TEST :
      `<a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(gui.CF_EXTRAS_CONTENT.TEST)">Test</a>`,
}

export class FvcExtras extends FScrollViewContent {
  constructor() {
    super();
    this._fMenu = new FSimpleList();
    this._fMenu.setDataSource(this);
    this._fMenu.setDelegate(this);
    this.setChild("menu", this._fMenu);

    this._subPageId = null;
  }

  getUrlParamString() {
    if (this._subPageId) {
      return C.URL_PARAM.PAGE + "=" + this._subPageId;
    } else {
      return "";
    }
  }

  initFromUrl(urlParam) {
    this.#onSubPageSelected(urlParam.get(C.URL_PARAM.PAGE), urlParam);
  }

  getListItemsForListFragment(fList) { return this.#getListItems(); }
  getSelectedItemIdForList(fList) { return this._subPageId; }

  onItemSelectedInList(fList, itemId) { this.#onSubPageSelected(itemId); }

  renderItemForSimpleListFragment(fSimpleList, item, panel) {
    let config = item.data;
    panel.replaceContent(
        this.#renderTitle(R.t(config.page.NAME), config.nNotifications));
  }

  action(type, ...args) {
    switch (type) {
    case CF_EXTRAS_CONTENT.TEST:
      this.#onTest();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
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

  _renderContentOnRender(render) {
    let p = new ListPanel();
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

  #getListItems() {
    let configs =
        this._dataSource.getPageConfigsForExtrasViewContentFragment(this);
    let items = [];
    for (let c of configs) {
      items.push({
        id : c.ID,
        icon : c.ICON,
        data : {
          page : c,
          nNotifications :
              this._dataSource
                  .getNPageNotificationsForExtrasViewContentFragment(this, c.ID)
        },
        isSelectable : true,
      });
    }
    return items;
  }

  #renderTitle(name, nNotifications) {
    if (nNotifications) {
      return name + " " +
             _CFT_EXTRAS_CONTENT.BADGE.replace("__BADGE__", nNotifications);
    } else {
      return name;
    }
  }

  #renderTest() {
    let s = _CFT_EXTRAS_CONTENT.BTN_TEST;
    return s;
  }

  #onSubPageSelected(pageId, urlParam = null) {
    this._subPageId = pageId;
    let v = this._dataSource.createPageEntryViewForExtrasViewContentFragment(
        this, pageId);
    if (v) {
      this._owner.onFragmentRequestShowView(this, v, pageId);
      if (urlParam) {
        v.initFromUrl(urlParam);
      }
    }
  }

  #onTest() {
    let e = {};
    e.type = RemoteError.T_TYPE.DEV;
    e.type = RemoteError.T_TYPE.QUOTA;
    e.code = "Q_LIVE_STREAM";
    e.data = {period : 1000, quota : 3, fallback_period : 1000};
    this._owner.onRemoteErrorInFragment(this, e);
    //  fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, e);
  }
};

