(function(main) {
class Gateway extends ext.Controller {
  static T_CONFIG = {
    FRONT_PAGE :
        {ID : C.ID.SECTOR.FRONT_PAGE, NAME: "FrontPage", ICON: C.ICON.HOME},
    BLOG: {ID: C.ID.SECTOR.BLOG, NAME: "Blog", ICON: C.ICON.BLOG},
    MESSENGER:
        {ID: C.ID.SECTOR.MESSENGER, NAME: "Messenger", ICON: C.ICON.MESSENGER},
    WORKSHOP:
        {ID: C.ID.SECTOR.WORKSHOP, NAME: "Workshop", ICON: C.ICON.WORKSHOP},
    SHOP: {ID: C.ID.SECTOR.SHOP, NAME: "Shop", ICON: C.ICON.SHOP},
    EXTRAS: {ID: C.ID.SECTOR.EXTRAS, NAME: "Extras", ICON: ui.ICONS.MORE},
    CONFIG: {
      ID: C.ID.SECTOR.WEB_CONFIG,
      NAME: "WebConfig",
      ICON: C.ICON.WEB_CONFIG
    },
    COMMUNITY:
        {ID: C.ID.SECTOR.COMMUNITY, NAME: "Community", ICON: C.ICON.COMMUNITY},
    EXCHANGE:
        {ID: C.ID.SECTOR.EXCHANGE, NAME: "Exchange", ICON: C.ICON.EXCHANGE},
    EMAIL: {ID: C.ID.SECTOR.EMAIL, NAME: "Email", ICON: C.ICON.EMAIL},
    CART: {ID: C.ID.SECTOR.ORDERS, NAME: "Cart", ICON: C.ICON.CART},
    ACCOUNT: {ID: C.ID.SECTOR.ACCOUNT, NAME: "Account", ICON: C.ICON.PROFILE},
    ABOUT: {ID: C.ID.SECTOR.ABOUT, NAME: "About", ICON: C.ICON.INFO},
    PROFILE: {ID: C.ID.SECTOR.PROFILE, NAME: "Profile", ICON: C.ICON.INFO},
    G_HOSTING: {
      ID: C.ID.SECTOR.GUEST_HOSTING,
      NAME: "Build my own website for free",
      ICON: C.ICON.HOSTING
    },
    HOSTING: {ID: C.ID.SECTOR.HOSTING, NAME: "Hosting", ICON: C.ICON.HOSTING},
    CAREERS: {ID: C.ID.SECTOR.CAREERS, NAME: "Careers", ICON: C.ICON.EMPLOYEE},
    LOGIN: {ID: C.ID.SECTOR.LOGIN, NAME: "Login", ICON: null}, // Fake
    ACTIVATION: {
      ID: C.ID.SECTOR.ACTIVATION,
      NAME: "Account activation",
      ICON: null
    }, // Fake
    RESET_PASS: {
      ID: C.ID.SECTOR.RESET_PASS,
      NAME: "Reset password",
      ICON: null
    }, // Fake
    SCHOOL: {ID: C.ID.SECTOR.SCHOOL, NAME: "School", ICON: C.ICON.SCHOOL},
    GADGET: {ID: C.ID.SECTOR.GADGET, NAME: "Gadget", ICON: null}, // Fake
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
    case C.ID.SECTOR.WORKSHOP:
      b = dba.Workshop.isOpen();
      break;
    case C.ID.SECTOR.SHOP:
      b = dba.Shop.isOpen();
      break;
    default:
      break;
    }
    return b;
  }

  #shouldEnableSessionAction(pageId) {
    let b = true;
    switch (pageId) {
    case C.ID.SECTOR.FRONT_PAGE:
      b = dba.WebConfig.getFrontPageConfig().isLoginEnabled();
      break;
    default:
      break;
    }
    return b;
  }

  #getNPageNotifications(pageId) {
    let n = 0;
    switch (pageId) {
    case C.ID.SECTOR.MESSENGER:
      n = dba.Notifications.getNMessengerNotifications();
      break;
    case C.ID.SECTOR.BLOG:
      n = dba.Notifications.getNBlogNotifications();
      break;
    case C.ID.SECTOR.WORKSHOP:
      n = dba.Notifications.getNWorkshopNotifications();
      break;
    case C.ID.SECTOR.SHOP:
      n = dba.Notifications.getNShopNotifications();
      break;
    case C.ID.SECTOR.EMAIL:
      n = dba.Notifications.getNEmailNotifications();
      break;
    default:
      break;
    }
    return n;
  }

  #getPageConfigs() {
    if (plt.Env.isWeb3()) {
      return this.#getWeb3PageConfigs();
    } else {
      return this.#getWeb2PageConfigs();
    }
  }

  #getWeb3PageConfigs() { return [ this.constructor.T_CONFIG.BLOG ]; }

  #getWeb2PageConfigs() {
    if (this.#sectorId == C.ID.SECTOR.GADGET) {
      return this.#getGadgetPageConfigs();
    }

    // Customized frontpage
    if (!dba.Account.isAuthenticated() && dba.WebConfig.getFrontPageConfig()) {
      return [ this.constructor.T_CONFIG.FRONT_PAGE ];
    }

    // Default
    let configs = [ this.constructor.T_CONFIG.BLOG ];
    if (dba.Account.isAuthenticated()) {
      configs.push(this.constructor.T_CONFIG.MESSENGER);
    }

    // Shop, still in development
    if (dba.Account.isBetaTester() || dba.WebConfig.isDevSite()) {
      if (dba.Account.isWebOwner() || dba.Shop.isOpen()) {
        configs.push(this.constructor.T_CONFIG.SHOP);
      }
    }

    // Workshop
    if (dba.Account.isWebOwner() || dba.Workshop.isOpen()) {
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
    if (plt.Env.isWeb3()) {
      if (dba.Account.isAuthenticated()) {
        return this.#getWeb3OwnerPageConfigs();
      } else {
        return this.#getWeb3GuestPageConfigs();
      }
    } else {
      if (dba.Account.isAuthenticated()) {
        if (dba.Account.isWebOwner()) {
          return this.#getOwnerPageConfigs();
        } else if (plt.Env.isTrustedSite()) {
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
    if (dba.WebConfig.getFrontPageConfig()) {
      return [];
    }

    let items = [];
    let owner = dba.WebConfig.getOwner();
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
    let owner = dba.WebConfig.getOwner();
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

    if (dba.Blog.getOpenRoleIds().length ||
        (dba.Workshop.isOpen() && dba.Workshop.getOpenTeamIds().length)) {
      items.push(this.constructor.T_CONFIG.CAREERS);
    }

    if (dba.Shop.isOpen()) {
      if (dba.Account.isBetaTester() || dba.WebConfig.isDevSite()) {
        items.push(this.constructor.T_CONFIG.CART);
      }
    }
    return items;
  }

  #getMemberPageConfigs() {
    let items = [];
    items.push(this.constructor.T_CONFIG.COMMUNITY);
    if (dba.WebConfig.isDevSite()) {
      items.push(this.constructor.T_CONFIG.EXCHANGE);
    }
    items.push(this.constructor.T_CONFIG.EMAIL);
    if (dba.Account.hasDomain()) {
      // Required here in case user lost access to their own website
      items.push(this.constructor.T_CONFIG.HOSTING);
    } else {
      items.push(this.constructor.T_CONFIG.G_HOSTING);
    }
    items.push(this.constructor.T_CONFIG.PROFILE);
    items.push(this.constructor.T_CONFIG.ACCOUNT);
    if (dba.Account.isBetaTester() || dba.WebConfig.isDevSite()) {
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
    if (dba.WebConfig.isDevSite()) {
      items.push(this.constructor.T_CONFIG.EXCHANGE);
    }
    items.push(this.constructor.T_CONFIG.EMAIL);
    items.push(this.constructor.T_CONFIG.HOSTING);
    items.push(this.constructor.T_CONFIG.PROFILE);
    items.push(this.constructor.T_CONFIG.ACCOUNT);
    if (dba.Account.isBetaTester() || dba.WebConfig.isDevSite()) {
      items.push(this.constructor.T_CONFIG.CART);
    }
    items.push(this.constructor.T_CONFIG.CONFIG);
    return items;
  }

  #createSectorGateway(sectorId) {
    let gw = null;
    switch (sectorId) {
    case C.ID.SECTOR.GADGET:
      // Gadget share same gateway as main.
      break;
    case C.ID.SECTOR.SCHOOL:
      gw = new scol.Gateway();
      break;
    default:
      gw = new psud.Gateway(sectorId);
      break;
    }
    return gw;
  }

  #createPageEntryViews(pageId) {
    let gateway;
    let f;
    let vs = [];
    switch (pageId) {
    case C.ID.SECTOR.FRONT_PAGE:
      vs = [ new ui.View() ];
      gateway = new ftpg.Gateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case C.ID.SECTOR.BLOG:
      vs = [ new ui.View() ];
      gateway = new blog.Gateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case C.ID.SECTOR.MESSENGER:
      vs = [ new ui.View() ];
      gateway = new msgr.Gateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case C.ID.SECTOR.WORKSHOP:
      vs = [ new ui.View() ];
      gateway = new wksp.Gateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case C.ID.SECTOR.SHOP:
      vs = [ new ui.View() ];
      gateway = new shop.Gateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case C.ID.SECTOR.WEB_CONFIG:
      vs = [ new ui.View() ];
      gateway = new hstn.Gateway();
      vs[0].setContentFragment(
          gateway.createWebConfigMainViewContentFragment());
      break;
    case C.ID.SECTOR.COMMUNITY:
      vs = [ new ui.View() ];
      vs[0].setContentFragment(new cmut.FvcMain());
      break;
    case C.ID.SECTOR.ORDERS:
      vs = [ new ui.View() ];
      gateway = new cart.Gateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case C.ID.SECTOR.ACCOUNT:
      vs = [ new ui.View() ];
      gateway = new acnt.Gateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case C.ID.SECTOR.ABOUT:
      vs = [ new ui.View() ];
      f = new hr.FvcUserInfo();
      f.setUserId(dba.WebConfig.getOwnerId());
      vs[0].setContentFragment(f);
      break;
    case C.ID.SECTOR.PROFILE:
      vs = [ new ui.View() ];
      f = new hr.FvcUserInfo();
      f.setUserId(dba.Account.getId());
      vs[0].setContentFragment(f);
      break;
    case C.ID.SECTOR.HOSTING:
      vs = [ new ui.View() ];
      gateway = new hstn.Gateway();
      vs[0].setContentFragment(gateway.createMemberMainViewContentFragment());
      break;
    case C.ID.SECTOR.GUEST_HOSTING:
      vs = [ new ui.View() ];
      gateway = new hstn.Gateway();
      vs[0].setContentFragment(gateway.createGuestMainViewContentFragment());
      break;
    case C.ID.SECTOR.CAREERS:
      vs = [ new ui.View() ];
      gateway = new hr.Gateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case C.ID.SECTOR.EXCHANGE:
      vs = [ new ui.View() ];
      gateway = new xchg.Gateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case C.ID.SECTOR.EMAIL:
      vs = [ new ui.View() ];
      gateway = new emal.Gateway();
      vs[0].setContentFragment(gateway.createMainViewContentFragment());
      break;
    case C.ID.SECTOR.LOGIN:
      gateway = new auth.Gateway();
      vs = [ gateway.createLoginView() ];
      break;
    case C.ID.SECTOR.RESET_PASS:
      vs = [ new ui.View() ];
      vs[0].setContentFragment(new auth.FvcResetPassword());
      break;
    case C.ID.SECTOR.ACTIVATION:
      vs = [ new ui.View() ];
      vs[0].setContentFragment(new auth.FvcAccountActivation());
      break;
    default:
      break;
    }
    return vs;
  }
};

main.Gateway = Gateway;
}(window.main = window.main || {}));
