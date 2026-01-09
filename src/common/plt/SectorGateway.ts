import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export interface PageConfig {
  ID: string;
  NAME: string;
  ICON: string | null;
}

export interface SectorGateway {
  isLoginRequired(): boolean;
  isPageNavItem(_pageId: string): boolean;
  shouldEnableSessionAction(_pageId: string): boolean;
  getIcon(): string | null;
  getDefaultPageId(): string | null;
  getBannerFragment(): Fragment | null;
  getPageConfigs(): PageConfig[];
  getNPageNotifications(_pageId: string): number;
  createPageEntryViews(_pageId: string): View[];
  createPageOptionalViews(_pageId: string): View[];
}

