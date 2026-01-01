import Controller from '../../lib/ext/Controller.js';

export class SectorGateway extends Controller {
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
