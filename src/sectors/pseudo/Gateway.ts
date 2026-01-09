import { View } from '../../lib/ui/controllers/views/View.js';
import { ID } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { SectorGateway, PageConfig } from '../../common/plt/SectorGateway.js';
import { FvcQueueMain } from '../shop/FvcQueueMain.js';
import { FvcCounterMain } from '../shop/FvcCounterMain.js';
import { FvcQueueSide } from '../shop/FvcQueueSide.js';

export class Gateway implements SectorGateway {
  static T_CONFIG = {
    QUEUE : {ID : ID.SECTOR.QUEUE, NAME: "Queue", ICON: ICON.QUEUE},
    COUNTER: {ID: ID.SECTOR.COUNTER, NAME: "Counter", ICON: ICON.INFO},
  } as const;

  private _sectorId: string;

  constructor(sectorId: string) {
    this._sectorId = sectorId;
  }

  isLoginRequired(): boolean { return false; }
  isPageNavItem(_pageId: string): boolean { return false; }
  shouldEnableSessionAction(_pageId: string): boolean { return true; }

  getIcon(): string | null {
    let icon: string;
    switch (this._sectorId) {
    case this.constructor.T_CONFIG.COUNTER.ID:
      icon = this.constructor.T_CONFIG.COUNTER.ICON;
      break;
    case this.constructor.T_CONFIG.QUEUE.ID:
      icon = this.constructor.T_CONFIG.QUEUE.ICON;
      break;
    default:
      icon = this.constructor.T_CONFIG.QUEUE.ICON;
      break;
    }
    return icon;
  }

  getDefaultPageId(): string | null {
    let id: string;
    switch (this._sectorId) {
    case this.constructor.T_CONFIG.COUNTER.ID:
    case this.constructor.T_CONFIG.QUEUE.ID:
      id = this._sectorId;
      break;
    default:
      id = this.constructor.T_CONFIG.QUEUE.ID;
      break;
    }
    return id;
  }

  getPageConfigs(): PageConfig[] {
    let configs: PageConfig[] = [];
    switch (this._sectorId) {
    case this.constructor.T_CONFIG.COUNTER.ID:
      configs.push(this.constructor.T_CONFIG.COUNTER);
      break;
    case this.constructor.T_CONFIG.QUEUE.ID:
      configs.push(this.constructor.T_CONFIG.QUEUE);
      break;
    default:
      configs.push(this.constructor.T_CONFIG.QUEUE);
      break;
    }
    return configs;
  }

  createPageEntryViews(pageId: string): View[] {
    let vs: View[] = [];
    switch (pageId) {
    case this.constructor.T_CONFIG.QUEUE.ID:
      vs = [ new View() ];
      vs[0].setContentFragment(new FvcQueueMain());
      break;
    case this.constructor.T_CONFIG.COUNTER.ID:
      vs = [ new View() ];
      vs[0].setContentFragment(new FvcCounterMain());
      break;
    default:
      break;
    }
    return vs;
  }

  createPageOptionalViews(pageId: string): View[] {
    let vs: View[] = [];
    switch (pageId) {
    case this.constructor.T_CONFIG.QUEUE.ID:
      vs = [ new View() ];
      vs[0].setContentFragment(new FvcQueueSide());
      break;
    default:
      break;
    }
    return vs;
  }

  getBannerFragment(): Fragment | null { return null; }
  getNPageNotifications(_pageId: string): number { return 0; }
};
