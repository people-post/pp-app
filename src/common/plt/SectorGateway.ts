import Controller from '../../lib/ext/Controller.js';

export abstract class SectorGateway extends Controller {
  isLoginRequired(): boolean {
    return false;
  }

  isPageNavItem(_pageId: string): boolean {
    return false;
  }

  shouldEnableSessionAction(_pageId: string): boolean {
    return true;
  }

  getIcon(): string | null {
    return null;
  }

  getDefaultPageId(): string | null {
    return null;
  }

  getBannerFragment(): unknown {
    return null;
  }

  getPageConfigs(): unknown[] {
    return [];
  }

  getNPageNotifications(_pageId: string): number {
    return 0;
  }

  createPageEntryViews(_pageId: string): unknown[] {
    return [];
  }

  createPageOptionalViews(_pageId: string): unknown[] {
    return [];
  }
}

