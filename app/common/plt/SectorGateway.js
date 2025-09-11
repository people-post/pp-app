(function(plt) {
class SectorGateway extends ext.Controller {
  isLoginRequired() { return false; }
  isPageNavItem(pageId) { return false; }

  shouldEnableSessionAction(pageId) { return true; }

  getIcon() { return null; }
  getDefaultPageId() { return null; }
  getBannerFragment() { return null; }
  getPageConfigs() { return []; }
  getNPageNotifications(pageId) { return 0; }

  createPageEntryViews(pageId) { return []; }
  createPageOptionalViews(pageId) { return []; }
};

plt.SectorGateway = SectorGateway;
}(window.plt = window.plt || {}));
