import { FViewContentWithHeroBanner } from '../../lib/ui/controllers/fragments/FViewContentWithHeroBanner.js';
import { FvcOwner } from './FvcOwner.js';
import { FvcExplorer } from './FvcExplorer.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { C } from '../../lib/framework/Constants.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';

export class FvcMain extends FViewContentWithHeroBanner {
  static #T_PAGE = {
    OWNER_OPEN : Symbol(),
    OWNER_CLOSED: Symbol(),
    VISITOR: Symbol(),
  };

  #fvcOwner;
  #fvcExplorer;
  #fMain;
  #pageType = null;

  constructor() {
    super();
    this.#fvcOwner = new FvcOwner();
    this.#fvcOwner.setDelegate(this);

    this.#fvcExplorer = new FvcExplorer();
    this.#fvcExplorer.setDelegate(this);

    this.#fMain = new FViewContentMux();
    this.#fMain.setDataSource(this);
    this.wrapContentFragment(this.#fMain);

    this.#resetContents();
  }

  initFromUrl(urlParam) {
    super.initFromUrl(urlParam);
    let addon = urlParam.get(C.URL_PARAM.ADDON);
    if (addon == C.URL_PARAM_ADDON_VALUE.CART) {
      this.#showCart();
    }
  }

  getNTabNoticesForViewContentMuxFragment(fMux, v) {
    let n = 0;
    switch (v) {
    case "REPORT":
      n = dba.Notifications.getNShopNotifications();
      break;
    default:
      break;
    }
    return n;
  }

  onNewProductAddedInShopOwnerContentFragment(fContent) {
    this.#fvcOwner.reload();
  }
  onOptionChangeInOptionsFragment(fMaster, value, isChecked) {
    if (isChecked && value == "MASTER") {
      this.#asyncOpenShop();
    }
  }
  onShopConfigFragmentRequestAddTeam(fConfig) {
    let v = new View();
    v.setContentFragment(new shop.FvcTeamEditor());
    this._owner.onFragmentRequestShowView(this, v, "Shop team");
  }
  onShopConfigFragmentRequestEditTeam(fConfig, teamId) {
    let v = new View();
    let f = new shop.FvcTeamEditor();
    f.setTeamId(teamId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Shop team");
  }
  onShopConfigFragmentRequestCloseShop(fConfig) { this.#asyncCloseShop(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.DRAFT_ORDERS:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    case plt.T_DATA.USER_PROFILE:
    case fwk.T_DATA.WEB_CONFIG:
      this.#resetContents();
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  #getPageType() {
    if (dba.Account.isWebOwner()) {
      if (dba.Shop.isOpen()) {
        return this.constructor.#T_PAGE.OWNER_OPEN;
      } else {
        return this.constructor.#T_PAGE.OWNER_CLOSED;
      }
    } else {
      return this.constructor.#T_PAGE.VISITOR;
    }
  }

  #resetContents() {
    let t = this.#getPageType();
    if (t == this.#pageType) {
      return;
    }

    this.#pageType = t;

    switch (t) {
    case this.constructor.#T_PAGE.OWNER_OPEN:
      this.#resetAsOwnerOpen();
      break;
    case this.constructor.#T_PAGE.OWNER_CLOSED:
      this.#resetAsOwnerClosed();
      break;
    default:
      this.#resetAsVisitor();
      break;
    }
  }

  #resetAsOwnerOpen() {
    this.#fMain.clearContents();
    this.setHeroBannerFragment(null);

    this.#fMain.addTab(
        {name : R.t("Market"), value : "NEWS", icon : C.ICON.EXPLORER},
        this.#fvcExplorer);

    this.#fvcOwner.setOwnerId(dba.WebConfig.getOwnerId());
    this.#fMain.addTab(
        {name : R.t("Mine"), value : "OWNER", icon : C.ICON.SMILEY},
        this.#fvcOwner);

    let ff = new shop.FvcOrderHistory();
    ff.setDelegate(this);
    this.#fMain.addTab(
        {name : R.t("Orders"), value : "ORDERS", icon : C.ICON.RECEIPT}, ff);

    ff = new shop.FvcConfig();
    ff.setDelegate(this);
    this.#fMain.addTab(
        {name : R.t("Config"), value : "CONFIG", icon : C.ICON.CONFIG}, ff);

    ff = new shop.FvcReport();
    ff.setDelegate(this);
    this.#fMain.addTab(
        {name : R.t("Report"), value : "REPORT", icon : C.ICON.REPORT}, ff);

    this.#fMain.switchTo("NEWS");
  }

  #resetAsOwnerClosed() {
    this.#fMain.clearContents();

    let ff = new OptionSwitch();
    ff.addOption(R.get("OPEN_SHOP"), "MASTER");
    ff.setDelegate(this);

    this.setHeroBannerFragment(ff);

    this.#fMain.addTab(
        {name : R.t("Market"), value : "NEWS", icon : C.ICON.EXPLORER},
        this.#fvcExplorer);
    this.#fMain.switchTo("NEWS");
  }

  #resetAsVisitor() {
    this.#fMain.clearContents();
    this.setHeroBannerFragment(null);

    this.#fvcOwner.setOwnerId(dba.WebConfig.getOwnerId());
    this.#fMain.addTab(
        {name : R.t("Products"), value : "OWNER", icon : C.ICON.PRODUCT},
        this.#fvcOwner);
    this.#fMain.switchTo("OWNER");
  }

  #showCart() {
    let v = new View();
    let f = new cart.FvcCurrent();
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Cart");
  }

  #asyncOpenShop() {
    let url = "api/shop/request_open";
    plt.Api.asyncFragmentCall(this, url).then(d => this.#onOpenShopRRR(d));
  }

  #onOpenShopRRR(data) { dba.WebConfig.setShopOpen(true); }

  #asyncCloseShop() {
    let url = "api/shop/request_close";
    plt.Api.asyncFragmentCall(this, url).then(d => this.#onCloseShopRRR(d));
  }

  #onCloseShopRRR(data) { dba.WebConfig.reset(data.web_config); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcMain = FvcMain;
}
