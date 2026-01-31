export const CF_SHOP_WALKIN_QUEUE_ITEM = {
  ON_CLICK : "CF_SHOP_WALKIN_QUEUE_ITEM_1",
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FvcSimpleFragmentList } from '../../lib/ui/controllers/fragments/FvcSimpleFragmentList.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Cart as CartDataType } from '../../common/datatypes/Cart.js';
import { CartItem } from '../../common/datatypes/CartItem.js';
import { WalkinQueueItem } from '../../common/datatypes/WalkinQueueItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { PWalkinQueueItem } from './PWalkinQueueItem.js';
import { PWalkinQueueItemInfo } from './PWalkinQueueItemInfo.js';
import { PWalkinQueueItemInfoPublic } from './PWalkinQueueItemInfoPublic.js';
import { FvcPreCheckout } from './FvcPreCheckout.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FLocalUserSearch } from '../../common/search/FLocalUserSearch.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { WalkinQueue } from '../../common/dba/WalkinQueue.js';
import { Users } from '../../common/dba/Users.js';
import { R } from '../../common/constants/R.js';
import { STATE } from '../../common/constants/Constants.js';
import { Api } from '../../common/plt/Api.js';
import { Utilities } from '../../common/Utilities.js';

export class FWalkinQueueItem extends Fragment {
  static T_LAYOUT = {INFO : "INFO", FULL: "FULL"};
  private _itemId: string | null = null;
  private _isActionEnabled = false;
  private _tLayout: string = FWalkinQueueItem.T_LAYOUT.INFO;

  private _fAction1: Button;
  private _fAction2: Button;
  private _fAgent: FUserInfo;
  private _fAgentSearch: FLocalUserSearch;
  private _fOnUserSelect: ((userId: string) => void) | null = null;

  constructor() {
    super();
    this._itemId = null;
    this._isActionEnabled = false;
    this._tLayout = FWalkinQueueItem.T_LAYOUT.INFO;

    this._fAction1 = new Button();
    this._fAction1.setDelegate(this);
    this.setChild("action1", this._fAction1);

    this._fAction2 = new Button();
    this._fAction2.setName(R.t("Dismiss..."));
    this._fAction2.setValue("__DISMISS");
    this._fAction2.setThemeType(Button.T_THEME.RISKY);
    this._fAction2.setLayoutType(Button.LAYOUT_TYPE.LARGE_CYCLE);
    this._fAction2.setDelegate(this);
    this.setChild("action2", this._fAction2);

    this._fAgent = new FUserInfo();
    this._fAgent.setLayoutType(FUserInfo.T_LAYOUT.MID_SQUARE);
    this.setChild("agent", this._fAgent);

    this._fAgentSearch = new FLocalUserSearch();
    this._fAgentSearch.setDelegate(this);

    this._fOnUserSelect = null;
  }

  onSimpleButtonClicked(fBtn: Button): void {
    switch (fBtn.getValue()) {
    case STATE.NEW:
      this.#onServe();
      break;
    case STATE.ACTIVE:
      this.#onCheckout();
      break;
    default:
      this.#onDismiss();
      break;
    }
  }

  onLocalUserSearchFragmentRequestFetchUserIds(_fSearch: FLocalUserSearch): void {
    this.#asyncGetWorkers(WebConfig.getOwnerId());
  }

  onSearchResultClickedInSearchFragment(_fSearch: FLocalUserSearch, itemType: string, itemId: string): void {
    switch (itemType) {
    case SocialItem.TYPE.USER:
      if (this._fOnUserSelect) {
        this._fOnUserSelect(itemId);
      }
      Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
      break;
    default:
      break;
    }
  }

  setItemId(id: string | null): void { this._itemId = id; }
  setLayoutType(t: string): void { this._tLayout = t; }
  setEnableAction(b: boolean): void { this._isActionEnabled = b; }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_SHOP_WALKIN_QUEUE_ITEM.ON_CLICK:
      // @ts-expect-error - delegate may have this method
      this._delegate?.onClickInWalkinQueueItemFragment?.(this, this._itemId);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
    case T_DATA.WALKIN_QUEUE_ITEM:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._itemId) return;
    let item = WalkinQueue.get(this._itemId);
    if (!item) {
      return;
    }
    let userId = item.getCustomerUserId();
    let name = "";
    if (userId) {
      let u = Users.get(userId);
      if (!u) {
        return;
      }
      name = u.getNickname();
    } else {
      name = item.getCustomerName();
    }
    let panel = this.#createPanel();
    render.wrapPanel(panel);

    // @ts-expect-error - dataSource may have this method
    if (this._dataSource?.isItemSelectedInWalkinQueueItemFragment?.(
            this, this._itemId)) {
      panel.invertColor();
    }

    let p = panel.getNameDecorPanel();
    if (p) {
      p.replaceContent("Customer: ");
    }

    p = panel.getNamePanel();
    p.replaceContent(name);

    p = panel.getStatusPanel();
    p.replaceContent(Utilities.renderStatus(item.getState(), item.getStatus()));

    p = panel.getActionPanel(0);
    if (p && this._isActionEnabled) {
      this.#renderPrimeActionButton(item, p);
    }
    p = panel.getActionPanel(1);
    if (p && this._isActionEnabled) {
      this.#renderSubPrimeActionButton(item, p);
    }
    p = panel.getAgentPanel();
    if (p && item.getAgentId()) {
      let pp = new ListPanel();
      pp.setClassName("flex flex-end center-align-items");
      p.wrapPanel(pp);

      let ppp = new Panel();
      pp.pushPanel(ppp);
      ppp.replaceContent("Serving by: ");

      ppp = new PanelWrapper();
      pp.pushPanel(ppp);
      this._fAgent.setUserId(item.getAgentId());
      this._fAgent.attachRender(ppp);
      this._fAgent.render();
    }
  }

  #createPanel(): PWalkinQueueItem | PWalkinQueueItemInfo | PWalkinQueueItemInfoPublic {
    let p: PWalkinQueueItem | PWalkinQueueItemInfo | PWalkinQueueItemInfoPublic;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.FULL:
      p = new PWalkinQueueItem();
      this._fAction1.setLayoutType(Button.LAYOUT_TYPE.LARGE_CYCLE);
      break;
    default:
      this._fAction1.setLayoutType(Button.LAYOUT_TYPE.SMALL);
      if (this._isActionEnabled) {
        p = new PWalkinQueueItemInfo();
        p.setAttribute("onclick",
                       "javascript:G.action('${CF_SHOP_WALKIN_QUEUE_ITEM.ON_CLICK}')");
      } else {
        p = new PWalkinQueueItemInfoPublic();
      }
      break;
    }
    return p;
  }

  #renderPrimeActionButton(item: WalkinQueueItem, panel: Panel): void {
    this._fAction1.setValue(item.getState());
    switch (item.getState()) {
    case STATE.NEW:
      this._fAction1.setName(R.t("Serve..."));
      this._fAction1.setThemeType(null);
      break;
    case STATE.ACTIVE:
      this._fAction1.setName(R.t("Checkout..."));
      this._fAction1.setThemeType(null);
      break;
    default:
      this._fAction1.setName(R.t("Dismiss..."));
      this._fAction1.setValue("__DISMISS");
      this._fAction1.setThemeType(Button.T_THEME.RISKY);
      break;
    }
    this._fAction1.attachRender(panel);
    this._fAction1.render();
  }

  #renderSubPrimeActionButton(item: WalkinQueueItem, panel: Panel): void {
    if (this._fAction1.getValue() != "__DISMISS") {
      this._fAction2.attachRender(panel);
      this._fAction2.render();
    }
  }

  #onServe(): void {
    let v = new View();
    let f = new FvcSimpleFragmentList();
    f.append(this._fAgentSearch);
    v.setContentFragment(f);

    this._fOnUserSelect = uid => this.#asyncServe(uid);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Set agent");
  }

  #onCheckout(): void {
    if (!this._itemId) return;
    let item = WalkinQueue.get(this._itemId);
    if (item) {
      this.#asyncPrepareCartItem(item);
    }
  }

  #asyncPrepareCartItem(qItem: WalkinQueueItem): void {
    let url = "api/cart/make_item";
    let fd = new FormData();
    fd.append("product_id", qItem.getProductId());
    fd.append("quantity", "1");
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onPrepareCartItemRRR(d));
  }

  #onPrepareCartItemRRR(data: { item: unknown }): void {
    let cart = new CartDataType();
    let item = new CartItem(data.item);
    cart.set(item.getId(), item);
    this.#goCheckout(cart);
  }

  #goCheckout(cart: CartDataType): void {
    let v = new View();
    let f = new FvcPreCheckout();
    f.setCart(cart);
    v.setContentFragment(f);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                "Pre checkout");
  }

  #onDismiss(): void {
    this._confirmDangerousOperation(R.t("Are you sure to remove?"),
                                    () => this.#asyncDismiss());
  }

  #asyncServe(userId: string): void {
    if (!this._itemId) return;
    let url = "api/shop/queue_serve_item";
    let fd = new FormData();
    fd.append("id", this._itemId);
    fd.append("agent_id", userId);
    Api.asFragmentPost(this, url, fd).then(d => this.#onServeRRR(d));
  }

  #onServeRRR(data: { item: unknown }): void {
    WalkinQueue.update(new WalkinQueueItem(data.item));
  }

  #asyncDismiss(): void {
    if (!this._itemId) return;
    let url = "api/shop/queue_dismiss_item";
    let fd = new FormData();
    fd.append("id", this._itemId);
    Api.asFragmentPost(this, url, fd).then(_d => this.#onDismissRRR());
  }

  #onDismissRRR(): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onItemDeletedInWalkinQueueItemFragment?.(this);
  }

  #asyncGetWorkers(ownerId: string | null): void {
    if (ownerId) {
      this._fAgentSearch.setUserIds([ ownerId ]);
      this._fAgentSearch.render();
    }
  }
}

export default FWalkinQueueItem;
