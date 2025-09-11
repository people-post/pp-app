(function(shop) {
shop.CF_SHOP_WALKIN_QUEUE_ITEM = {
  ON_CLICK : Symbol(),
};

class FWalkinQueueItem extends ui.Fragment {
  static T_LAYOUT = {INFO : "INFO", FULL: "FULL"};
  constructor() {
    super();
    this._itemId = null;
    this._isActionEnabled = false;
    this._tLayout = this.constructor.T_LAYOUT.INFO;

    this._fAction1 = new ui.Button();
    this._fAction1.setDelegate(this);
    this.setChild("action1", this._fAction1);

    this._fAction2 = new ui.Button();
    this._fAction2.setName(R.t("Dismiss..."));
    this._fAction2.setValue("__DISMISS");
    this._fAction2.setThemeType(ui.Button.T_THEME.RISKY);
    this._fAction2.setLayoutType(ui.Button.LAYOUT_TYPE.LARGE_CYCLE);
    this._fAction2.setDelegate(this);
    this.setChild("action2", this._fAction2);

    this._fAgent = new S.hr.FUserInfo();
    this._fAgent.setLayoutType(S.hr.FUserInfo.T_LAYOUT.MID_SQUARE);
    this.setChild("agent", this._fAgent);

    this._fAgentSearch = new srch.FLocalUserSearch();
    this._fAgentSearch.setDelegate(this);

    this._fOnUserSelect = null;
  }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn.getValue()) {
    case C.STATE.NEW:
      this.#onServe();
      break;
    case C.STATE.ACTIVE:
      this.#onCheckout();
      break;
    default:
      this.#onDismiss();
      break;
    }
  }

  onLocalUserSearchFragmentRequestFetchUserIds(fSearch) {
    this.#asyncGetWorkers(dba.WebConfig.getOwnerId());
  }

  onSearchResultClickedInSearchFragment(fSearch, itemType, itemId) {
    switch (itemType) {
    case dat.SocialItem.TYPE.USER:
      if (this._fOnUserSelect) {
        this._fOnUserSelect(itemId);
      }
      fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
      break;
    default:
      break;
    }
  }

  setItemId(id) { this._itemId = id; }
  setLayoutType(t) { this._tLayout = t; }
  setEnableAction(b) { this._isActionEnabled = b; }

  action(type, ...args) {
    switch (type) {
    case shop.CF_SHOP_WALKIN_QUEUE_ITEM.ON_CLICK:
      this._delegate.onClickInWalkinQueueItemFragment(this, this._itemId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILES:
    case plt.T_DATA.WALKIN_QUEUE_ITEM:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let item = dba.WalkinQueue.get(this._itemId);
    if (!item) {
      return;
    }
    let userId = item.getCustomerUserId();
    let name = "";
    if (userId) {
      let u = dba.Users.get(userId);
      if (!u) {
        return;
      }
      name = u.getNickname();
    } else {
      name = item.getCustomerName();
    }
    let panel = this.#createPanel();
    render.wrapPanel(panel);

    if (this._dataSource.isItemSelectedInWalkinQueueItemFragment(
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
      let pp = new ui.ListPanel();
      pp.setClassName("flex flex-end center-align-items");
      p.wrapPanel(pp);

      let ppp = new ui.Panel();
      pp.pushPanel(ppp);
      ppp.replaceContent("Serving by: ");

      ppp = new ui.PanelWrapper();
      pp.pushPanel(ppp);
      this._fAgent.setUserId(item.getAgentId());
      this._fAgent.attachRender(ppp);
      this._fAgent.render();
    }
  }

  #createPanel() {
    let p = null;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.FULL:
      p = new shop.PWalkinQueueItem();
      this._fAction1.setLayoutType(ui.Button.LAYOUT_TYPE.LARGE_CYCLE);
      break;
    default:
      this._fAction1.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
      if (this._isActionEnabled) {
        p = new shop.PWalkinQueueItemInfo();
        p.setAttribute("onclick",
                       "G.action(shop.CF_SHOP_WALKIN_QUEUE_ITEM.ON_CLICK)");
      } else {
        p = new shop.PWalkinQueueItemInfoPublic();
      }
      break;
    }
    return p;
  }

  #renderPrimeActionButton(item, panel) {
    this._fAction1.setValue(item.getState());
    switch (item.getState()) {
    case C.STATE.NEW:
      this._fAction1.setName(R.t("Serve..."));
      this._fAction1.setThemeType(null);
      break;
    case C.STATE.ACTIVE:
      this._fAction1.setName(R.t("Checkout..."));
      this._fAction1.setThemeType(null);
      break;
    default:
      this._fAction1.setName(R.t("Dismiss..."));
      this._fAction1.setValue("__DISMISS");
      this._fAction1.setThemeType(ui.Button.T_THEME.RISKY);
      break;
    }
    this._fAction1.attachRender(panel);
    this._fAction1.render();
  }

  #renderSubPrimeActionButton(item, panel) {
    if (this._fAction1.getValue() != "__DISMISS") {
      this._fAction2.attachRender(panel);
      this._fAction2.render();
    }
  }

  #onServe() {
    let v = new ui.View();
    let f = new ui.FvcSimpleFragmentList();
    f.append(this._fAgentSearch);
    v.setContentFragment(f);

    this._fOnUserSelect = uid => this.#asyncServe(uid);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Set agent");
  }

  #onCheckout() {
    let item = dba.WalkinQueue.get(this._itemId);
    if (item) {
      this.#asyncPrepareCartItem(item);
    }
  }

  #asyncPrepareCartItem(qItem) {
    let url = "api/cart/make_item";
    let fd = new FormData();
    fd.append("product_id", qItem.getProductId());
    fd.append("quantity", 1);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onPrepareCartItemRRR(d));
  }

  #onPrepareCartItemRRR(data) {
    let cart = new dat.Cart();
    let item = new dat.CartItem(data.item);
    cart.set(item.getId(), item);
    this.#goCheckout(cart);
  }

  #goCheckout(cart) {
    let v = new ui.View();
    let f = new shop.FvcPreCheckout();
    f.setCart(cart);
    v.setContentFragment(f);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
                                "Pre checkout");
  }

  #onDismiss() {
    this._confirmDangerousOperation(R.t("Are you sure to remove?"),
                                    () => this.#asyncDismiss());
  }

  #asyncServe(userId) {
    let url = "api/shop/queue_serve_item";
    let fd = new FormData();
    fd.append("id", this._itemId);
    fd.append("agent_id", userId);
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onServeRRR(d));
  }

  #onServeRRR(data) {
    dba.WalkinQueue.update(new dat.WalkinQueueItem(data.item));
  }

  #asyncDismiss() {
    let url = "api/shop/queue_dismiss_item";
    let fd = new FormData();
    fd.append("id", this._itemId);
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onDismissRRR(d));
  }

  #onDismissRRR(data) {
    this._delegate.onItemDeletedInWalkinQueueItemFragment(this);
  }

  #asyncGetWorkers(ownerId) {
    this._fAgentSearch.setUserIds([ ownerId ]);
    this._fAgentSearch.render();
  }
};

shop.FWalkinQueueItem = FWalkinQueueItem;
}(window.shop = window.shop || {}));
