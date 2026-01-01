import { Controller } from '../lib/ext/Controller.js';
import { View } from '../lib/ui/controllers/views/View.js';
import { ICONS } from '../lib/ui/Icons.js';
import { ID } from '../common/constants/Constants.js';
import { ICON } from '../common/constants/Icons.js';
import { Account } from '../common/dba/Account.js';
import { WebConfig } from '../common/dba/WebConfig.js';
import { Workshop } from '../common/dba/Workshop.js';
import { Shop } from '../common/dba/Shop.js';
import { Notifications } from '../common/dba/Notifications.js';
import { Blog } from '../common/dba/Blog.js';
import { R } from '../common/constants/R.js';
import { Gateway as FrontPageGateway } from '../sectors/frontpage/Gateway.js';
import { Gateway as BlogGateway } from '../sectors/blog/Gateway.js';
import { Gateway as MessengerGateway } from '../sectors/messenger/Gateway.js';
import { Gateway as WorkshopGateway } from '../sectors/workshop/Gateway.js';
import { Gateway as ShopGateway } from '../sectors/shop/Gateway.js';
import { Gateway as HostingGateway } from '../sectors/hosting/Gateway.js';
import { Gateway as CartGateway } from '../sectors/cart/Gateway.js';
import { Gateway as AccountGateway } from '../sectors/account/Gateway.js';
import { Gateway as ExchangeGateway } from '../sectors/exchange/Gateway.js';
import { Gateway as EmailGateway } from '../sectors/email/Gateway.js';
import { Gateway as AuthGateway } from '../sectors/auth/Gateway.js';
import { Gateway as SchoolGateway } from '../sectors/school/Gateway.js';
import { Gateway as PseudoGateway } from '../sectors/pseudo/Gateway.js';
import { Gateway as HrGateway } from '../sectors/hr/Gateway.js';
import { FvcMain } from '../sectors/community/FvcMain.js';
import { FvcUserInfo } from '../sectors/hr/FvcUserInfo.js';
import { FvcResetPassword } from '../sectors/auth/FvcResetPassword.js';
import { FvcAccountActivation } from '../sectors/auth/FvcAccountActivation.js';

export class Gateway extends Controller {
  static T_CONFIG = {
    FRONT_PAGE :
        {ID : ID.SECTOR.FRONT_PAGE, NAME: "FrontPage", ICON: ICON.HOME},
    BLOG: {ID: ID.SECTOR.BLOG, NAME: "Blog", ICON: ICON.BLOG},
    MESSENGER:
        {ID: ID.SECTOR.MESSENGER, NAME: "Messenger", ICON: ICON.MESSENGER},
    WORKSHOP:
        {ID: ID.SECTOR.WORKSHOP, NAME: "Workshop", ICON: ICON.WORKSHOP},
    SHOP: {ID: ID.SECTOR.SHOP, NAME: "Shop", ICON: ICON.SHOP},
    EXTRAS: {ID: ID.SECTOR.EXTRAS, NAME: "Extras", ICON: ICONS.MORE},
    CONFIG: {
      ID: ID.SECTOR.WEB_CONFIG,
      NAME: "WebConfig",
      ICON: ICON.WEB_CONFIG
    },
    COMMUNITY:
        {ID: ID.SECTOR.COMMUNITY, NAME: "Community", ICON: ICON.COMMUNITY},
    EXCHANGE:
        {ID: ID.SECTOR.EXCHANGE, NAME: "Exchange", ICON: ICON.EXCHANGE},
    EMAIL: {ID: ID.SECTOR.EMAIL, NAME: "Email", ICON: ICON.EMAIL},
    CART: {ID: ID.SECTOR.ORDERS, NAME: "Cart", ICON: ICON.CART},
    ACCOUNT: {ID: ID.SECTOR.ACCOUNT, NAME: "Account", ICON: ICON.PROFILE},
    ABOUT: {ID: ID.SECTOR.ABOUT, NAME: "About", ICON: ICON.INFO},
    PROFILE: {ID: ID.SECTOR.PROFILE, NAME: "Profile", ICON: ICON.INFO},
    G_HOSTING: {
      ID: ID.SECTOR.GUEST_HOSTING,
      NAME: "Build my own website for free",
      ICON: ICON.HOSTING
    },
    HOSTING: {ID: ID.SECTOR.HOSTING, NAME: "Hosting", ICON: ICON.HOSTING},
    CAREERS: {ID: ID.SECTOR.CAREERS, NAME: "Careers", ICON: ICON.EMPLOYEE},
    LOGIN: {ID: ID.SECTOR.LOGIN, NAME: "Login", ICON: null}, // Fake
    ACTIVATION: {
      ID: ID.SECTOR.ACTIVATION,
      NAME: "Account activation",
      ICON: null
    }, // Fake
    RESET_PASS: {
      ID: ID.SECTOR.RESET_PASS,
      NAME: "Reset password",
      ICON: null
    }, // Fake
    SCHOOL: {ID: ID.SECTOR.SCHOOL, NAME: "School", ICON: ICON.SCHOOL},
    GADGET: {ID: ID.SECTOR.GADGET, NAME: "Gadget", ICON: null}, // Fake
  };

  #sectorId; // sectorId here is more close to code, different concept than the
             // one used in url
  #sGateway;

  isLoginRequired() {
    return this.#sGateway && this.#sGateway.isLoginRequired();
  }

  isPageNavItem(pageId) {
    return this.#sGateway ? this.#sGateway.isPageNavItem(pageId)
                          : this.#isPageNavItem(pageId);
  }
  shouldEnableSessionAction(pageId) {
    return this.#sGateway ? this.#sGateway.shouldEnableSessionAction(pageId)
                          : this.#shouldEnableSessionAction(pageId);
  }

  getSectorId() { return this.#sectorId; }
  getIcon() { return this.#sGateway ? this.#sGateway.getIcon() : null; }
  getBannerFragment() {
    return this.#sGateway ? this.#sGateway.getBannerFragment() : null;
  }
  getDefaultPageId() {
    return this.#sGateway ? this.#sGateway.getDefaultPageId() : null;
  }
  getPageConfigs() {
    return this.#sGateway ? this.#sGateway.getPageConfigs()
                          : this.#getPageConfigs();
  }

  getNPageNotifications(pageId) {
    return this.#sGateway ? this.#sGateway.getNPageNotifications(pageId)
                          : this.#getNPageNotifications(pageId);
  }

  getExtrasPageConfigs() {
    // TODO: sGateway currently do not have such method
    return this.#sGateway ? [] : this.#getExtrasPageConfigs();
  }

  setSectorId(id) {
    this.#sectorId = id;
    this.#sGateway = this.#createSectorGateway(id);
  }

  createPageEntryViews(pageId) {
    return this.#sGateway ? this.#sGateway.createPageEntryViews(pageId)
                          : this.#createPageEntryViews(pageId);
  }

  createPageOptionalViews(pageId) {
    return this.#sGateway ? this.#sGateway.createPageOptionalViews(pageId) : [];
  }

  #isPageNavItem(pageId) {
    let b = false;
    switch (pageId) {
    case ID.SECTOR.WORKSHOP:
      b = Workshop.isOpen();
      break;
    case ID.SECTOR.SHOP:
      b = Shop.isOpen();
      break;
    default:
      break;
    }
    return b;
  }

  #shouldEnableSessionAction(pageId) {
    let b = true;
    switch (pageId) {
    case ID.SECTOR.FRONT_PAGE:
      b = WebConfig.getFrontPageConfig().isLoginEnabled();
      break;
    default:
      break;
    }
    return b;
  }

  #getNPageNotifications(pageId) {
    let n = 0;
    switch (pageId) {
    case ID.SECTOR.MESSENGER:
      n = Notifications.getNMessengerNotifications();
      break;
    case ID.SECTOR.BLOG:
      n = Notifications.getNBlogNotifications();
      break;
    case ID.SECTOR.WORKSHOP:
      n = Notifications.getNWorkshopNotifications();
      break;
    case ID.SECTOR.SHOP:
      n = Notifications.getNShopNotifications();
      break;
    case ID.SECTOR.EMAIL:
      n = Notifications.getNEmailNotifications();
      break;
    default:
      break;
    }
    return n;
  }

  #getPageConfigs() {
    if (glb.env.isWeb3()) {
      return this.#getWeb3PageConfigs();
    } else {
      return this.#getWeb2PageConfigs();
    }
  }

  #getWeb3PageConfigs() { return [ this.constructor.T_CONFIG.BLOG ]; }

  #getWeb2PageConfigs() {
    if (this.#sectorId == ID.SECTOR.GADGET) {
      return this.#getGadgetPageConfigs();
    }

    // Customized frontpage
    if (!Account.isAuthenticated() && WebConfig.getFrontPageConfig()) {
      return [ this.constructor.T_CONFIG.FRONT_PAGE ];
    }

    // Default
    let configs = [ this.constructor.T_CONFIG.BLOG ];
    if (Account.isAuthenticated()) {
      configs.push(this.constructor.T_CONFIG.MESSENGER);
    }

    // Shop, still in development
    if (Account.isBetaTester() || WebConfig.isDevSite()) {
      if (Account.isWebOwner() || Shop.isOpen()) {
        configs.push(this.constructor.T_CONFIG.SHOP);
      }
    }

    // Workshop
    if (Account.isWebOwner() || Workshop.isOpen()) {
      configs.push(this.constructor.T_CONFIG.WORKSHOP);
    }
    return configs;
  }

  #getGadgetPageConfigs() {
    return [
      this.constructor.T_CONFIG.LOGIN, this.constructor.T_CONFIG.ACTIVATION,
      this.constructor.T_CONFIG.RESET_PASS
    ];
  }

  #getExtrasPageConfigs() {
    if (glb.env.isWeb3()) {
      if (Account.isAuthenticated()) {
        return this.#getWeb3OwnerPageConfigs();
      } else {
        return this.#getWeb3GuestPageConfigs();
      }
    } else {
      if (Account.isAuthenticated()) {
        if (Account.isWebOwner()) {
          return this.#getOwnerPageConfigs();
        } else if (glb.env.isTrustedSite()) {
          return this.#getMemberPageConfigs();
        } else {
          return this.#getVisitorPageConfigs();
        }
      } else {
        return this.#getGuestPageConfigs();
      }
    }
  }

  #getWeb3GuestPageConfigs() { return []; }

  #getGuestPageConfigs() {
    if (WebConfig.getFrontPageConfig()) {
      return [];
    }

    let items = [];
    let owner = WebConfig.getOwner();
    if (owner && owner.getCommunityId()) {
      items.push(this.constructor.T_CONFIG.COMMUNITY);
    }
    let p = this.constructor.T_CONFIG.ABOUT;
    if (owner) {
      p.NAME = R.t("About") + " " + owner.getNickname();
    } else {
      p.NAME = "...";
    }
    items.push(p);
    items.push(this.constructor.T_CONFIG.G_HOSTING);
    return items;
  }

  #getVisitorPageConfigs() {
    let items = [];
    let owner = WebConfig.getOwner();
    if (owner && owner.getCommunityId()) {
      items.push(this.constructor.T_CONFIG.COMMUNITY);
    }
    let p = this.constructor.T_CONFIG.ABOUT;
    if (owner) {
      p.NAME = R.t("About") + " " + owner.getNickname();
    } else {
      p.NAME = "...";
    }
    items.push(p);

    if (Blog.getOpenRoleIds().length ||
        (Workshop.isOpen() && Workshop.getOpenTeamIds().length)) {
      items.push(this.constructor.T_CONFIG.CAREERS);
    }

    if (Shop.isOpen()) {
      if (Account.isBetaTester() || WebConfig.isDevSite()) {
        items.push(this.constructor.T_CONFIG.CART);
      }
    }
    return items;
  }

  #getMemberPageConfigs() {
    let items = [];
    items.push(this.constructor.T_CONFIG.COMMUNITY);
    if (WebConfig.isDevSite()) {
      items.push(this.constructor.T_CONFIG.EXCHANGE);
    }
    items.push(this.constructor.T_CONFIG.EMAIL);
    if (Account.hasDomain()) {
      // Required here in case user lost access to their own website
      items.push(this.constructor.T_CONFIG.HOSTING);
    } else {
      items.push(this.constructor.T_CONFIG.G_HOSTING);
    }
    items.push(this.constructor.T_CONFIG.PROFILE);
    items.push(this.constructor.T_CONFIG.ACCOUNT);
    if (Account.isBetaTester() || WebConfig.isDevSite()) {
      items.push(this.constructor.T_CONFIG.CART);
    }
    return items;
  }

  #getWeb3OwnerPageConfigs() {
    return [
      this.constructor.T_CONFIG.EXCHANGE, this.constructor.T_CONFIG.HOSTING,
      this.constructor.T_CONFIG.ACCOUNT
    ];
  }

  #getOwnerPageConfigs() {
    let items = [];
    items.push(this.constructor.T_CONFIG.COMMUNITY);
    if (WebConfig.isDevSite()) {
      items.push(this.constructor.T_CONFIG.EXCHANGE);
    }
    items.push(this.constructor.T_CONFIG.EMAIL);
    items.push(this.constructor.T_CONFIG.HOSTING);
    items.push(this.constructor.T_CONFIG.PROFILE);
    items.push(this.constructor.T_CONFIG.ACCOUNT);
    if (Account.isBetaTester() || WebConfig.isDevSite()) {
      items.push(this.constructor.T_CONFIG.CART);
    }
    items.push(this.constructor.T_CONFIG.CONFIG);
    return items;
  }

  #createSectorGateway(sectorId) {
    let gw = null;
    switch (sectorId) {
    case ID.SECTOR.GADGET:
      // Gadget share same gateway as main.
      break;
    case ID.SECTOR.SCHOOL:
      gw = new SchoolGateway();
      break;
    default:
      gw = new PseudoGateway(sectorId);
      break;
    }
    return gw;
  }

  #createPageEntryViews(pageId) {
    let gateway;
    let f;
    let vs = [];
    switch (pageId) {
    case ID.SECTOR.FRONT_PAGE:
      vs = [ new View() ];
      gateway = new FrontPageGateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case ID.SECTOR.BLOG:
      vs = [ new View() ];
      gateway = new BlogGateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case ID.SECTOR.MESSENGER:
      vs = [ new View() ];
      gateway = new MessengerGateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case ID.SECTOR.WORKSHOP:
      vs = [ new View() ];
      gateway = new WorkshopGateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case ID.SECTOR.SHOP:
      vs = [ new View() ];
      gateway = new ShopGateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case ID.SECTOR.WEB_CONFIG:
      vs = [ new View() ];
      gateway = new HostingGateway();
      vs[0].setContentFragment(
          gateway.createWebConfigMainViewContentFragment());
      break;
    case ID.SECTOR.COMMUNITY:
      vs = [ new View() ];
      vs[0].setContentFragment(new FvcMain());
      break;
    case ID.SECTOR.ORDERS:
      vs = [ new View() ];
      gateway = new CartGateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case ID.SECTOR.ACCOUNT:
      vs = [ new View() ];
      gateway = new AccountGateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case ID.SECTOR.ABOUT:
      vs = [ new View() ];
      f = new FvcUserInfo();
      f.setUserId(WebConfig.getOwnerId());
      vs[0].setContentFragment(f);
      break;
    case ID.SECTOR.PROFILE:
      vs = [ new View() ];
      f = new FvcUserInfo();
      f.setUserId(Account.getId());
      vs[0].setContentFragment(f);
      break;
    case ID.SECTOR.HOSTING:
      vs = [ new View() ];
      gateway = new HostingGateway();
      vs[0].setContentFragment(gateway.createMemberMainViewContentFragment());
      break;
    case ID.SECTOR.GUEST_HOSTING:
      vs = [ new View() ];
      gateway = new HostingGateway();
      vs[0].setContentFragment(gateway.createGuestMainViewContentFragment());
      break;
    case ID.SECTOR.CAREERS:
      vs = [ new View() ];
      gateway = new HrGateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case ID.SECTOR.EXCHANGE:
      vs = [ new View() ];
      gateway = new ExchangeGateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case ID.SECTOR.EMAIL:
      vs = [ new View() ];
      gateway = new EmailGateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case ID.SECTOR.LOGIN:
      gateway = new AuthGateway();
      vs = [ gateway.createLoginView() ];
      break;
    case ID.SECTOR.RESET_PASS:
      vs = [ new View() ];
      vs[0].setContentFragment(new FvcResetPassword());
      break;
    case ID.SECTOR.ACTIVATION:
      vs = [ new View() ];
      vs[0].setContentFragment(new FvcAccountActivation());
      break;
    default:
      break;
    }
    return vs;
  }
};
