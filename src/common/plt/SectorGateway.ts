import Controller from '../../lib/ext/Controller.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export interface PageConfig {
  ID: string;
  NAME: string;
  ICON: string | null;
}

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

  getBannerFragment(): Fragment | null {
    return null;
  }

  getPageConfigs(): PageConfig[] {
    return [];
  }

  getNPageNotifications(_pageId: string): number {
    return 0;
  }

  createPageEntryViews(_pageId: string): View[] {
    return [];
  }

  createPageOptionalViews(_pageId: string): View[] {
    return [];
  }
}

