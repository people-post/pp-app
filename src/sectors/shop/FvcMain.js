import { FViewContentWithHeroBanner } from '../../lib/ui/controllers/fragments/FViewContentWithHeroBanner.js';
import { FvcOwner } from './FvcOwner.js';
import { FvcExplorer } from './FvcExplorer.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { URL_PARAM, URL_PARAM_ADDON_VALUE } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { T_DATA } from '../../common/plt/Events.js';
import { T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { FvcTeamEditor } from './FvcTeamEditor.js';
import { FvcOrderHistory } from './FvcOrderHistory.js';
import { FvcConfig } from './FvcConfig.js';
import { FvcReport } from './FvcReport.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { Account } from '../../common/dba/Account.js';
import { Shop } from '../../common/dba/Shop.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { FvcCurrent } from '../../sectors/cart/FvcCurrent.js';
import { R } from '../../common/constants/R.js';

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
    let addon = urlParam.get(URL_PARAM.ADDON);
    if (addon == URL_PARAM_ADDON_VALUE.CART) {
      this.#showCart();
    }
  }

  getNTabNoticesForViewContentMuxFragment(fMux, v) {
    let n = 0;
    switch (v) {
    case "REPORT":
      n = Notifications.getNShopNotifications();
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
    v.setContentFragment(new FvcTeamEditor());
    this._owner.onFragmentRequestShowView(this, v, "Shop team");
  }
  onShopConfigFragmentRequestEditTeam(fConfig, teamId) {
    let v = new View();
    let f = new FvcTeamEditor();
    f.setTeamId(teamId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Shop team");
  }
  onShopConfigFragmentRequestCloseShop(fConfig) { this.#asyncCloseShop(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.DRAFT_ORDERS:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    case T_DATA.USER_PROFILE:
    case FwkT_DATA.WEB_CONFIG:
      this.#resetContents();
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  #getPageType() {
    if (Account.isWebOwner()) {
      if (Shop.isOpen()) {
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
        {name : R.t("Market"), value : "NEWS", icon : ICON.EXPLORER},
        this.#fvcExplorer);

    this.#fvcOwner.setOwnerId(WebConfig.getOwnerId());
    this.#fMain.addTab(
        {name : R.t("Mine"), value : "OWNER", icon : ICON.SMILEY},
        this.#fvcOwner);

    let ff = new FvcOrderHistory();
    ff.setDelegate(this);
    this.#fMain.addTab(
        {name : R.t("Orders"), value : "ORDERS", icon : ICON.RECEIPT}, ff);

    ff = new FvcConfig();
    ff.setDelegate(this);
    this.#fMain.addTab(
        {name : R.t("Config"), value : "CONFIG", icon : ICON.CONFIG}, ff);

    ff = new FvcReport();
    ff.setDelegate(this);
    this.#fMain.addTab(
        {name : R.t("Report"), value : "REPORT", icon : ICON.REPORT}, ff);

    this.#fMain.switchTo("NEWS");
  }

  #resetAsOwnerClosed() {
    this.#fMain.clearContents();

    let ff = new OptionSwitch();
    ff.addOption(R.get("OPEN_SHOP"), "MASTER");
    ff.setDelegate(this);

    this.setHeroBannerFragment(ff);

    this.#fMain.addTab(
        {name : R.t("Market"), value : "NEWS", icon : ICON.EXPLORER},
        this.#fvcExplorer);
    this.#fMain.switchTo("NEWS");
  }

  #resetAsVisitor() {
    this.#fMain.clearContents();
    this.setHeroBannerFragment(null);

    this.#fvcOwner.setOwnerId(WebConfig.getOwnerId());
    this.#fMain.addTab(
        {name : R.t("Products"), value : "OWNER", icon : ICON.PRODUCT},
        this.#fvcOwner);
    this.#fMain.switchTo("OWNER");
  }

  #showCart() {
    let v = new View();
    let f = new FvcCurrent();
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Cart");
  }

  #asyncOpenShop() {
    let url = "api/shop/request_open";
    glb.api.asFragmentCall(this, url).then(d => this.#onOpenShopRRR(d));
  }

  #onOpenShopRRR(data) { WebConfig.setShopOpen(true); }

  #asyncCloseShop() {
    let url = "api/shop/request_close";
    glb.api.asFragmentCall(this, url).then(d => this.#onCloseShopRRR(d));
  }

  #onCloseShopRRR(data) { WebConfig.reset(data.web_config); }
};
