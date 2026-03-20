import { View } from '../../lib/ui/controllers/views/View.js';
import { ID } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import type { PageConfig } from '../../lib/ui/controllers/PageConfig.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FvcQueueMain } from '../../sectors/shop/FvcQueueMain.js';
import { FvcCounterMain } from '../../sectors/shop/FvcCounterMain.js';
import { FvcQueueSide } from '../../sectors/shop/FvcQueueSide.js';

export class PseudoComposer implements SectorGateway {
  static T_CONFIG = {
    QUEUE : {ID : ID.SECTOR.QUEUE, NAME: "Queue", ICON: ICON.QUEUE},
    COUNTER: {ID: ID.SECTOR.COUNTER, NAME: "Counter", ICON: ICON.INFO},
  } as const;

  #sectorId: string;

  constructor(sectorId: string) {
    this.#sectorId = sectorId;
  }

  isLoginRequired(): boolean { return false; }
  isPageNavItem(_pageId: string): boolean { return false; }
  shouldEnableSessionAction(_pageId: string): boolean { return true; }

  getIcon(): string | null {
    switch (this.#sectorId) {
    case PseudoComposer.T_CONFIG.COUNTER.ID:
      return PseudoComposer.T_CONFIG.COUNTER.ICON;
    case PseudoComposer.T_CONFIG.QUEUE.ID:
      return PseudoComposer.T_CONFIG.QUEUE.ICON;
    default:
      return PseudoComposer.T_CONFIG.QUEUE.ICON;
    }
  }

  getDefaultPageId(): string | null {
    switch (this.#sectorId) {
    case PseudoComposer.T_CONFIG.COUNTER.ID:
    case PseudoComposer.T_CONFIG.QUEUE.ID:
      return this.#sectorId;
    default:
      return PseudoComposer.T_CONFIG.QUEUE.ID;
    }
  }

  getPageConfigs(): PageConfig[] {
    switch (this.#sectorId) {
    case PseudoComposer.T_CONFIG.COUNTER.ID:
      return [ PseudoComposer.T_CONFIG.COUNTER ];
    case PseudoComposer.T_CONFIG.QUEUE.ID:
      return [ PseudoComposer.T_CONFIG.QUEUE ];
    default:
      return [ PseudoComposer.T_CONFIG.QUEUE ];
    }
  }

  createPageEntryViews(pageId: string): View[] {
    switch (pageId) {
    case PseudoComposer.T_CONFIG.QUEUE.ID: {
      let view = new View();
      view.setContentFragment(new FvcQueueMain());
      return [ view ];
    }
    case PseudoComposer.T_CONFIG.COUNTER.ID: {
      let view = new View();
      view.setContentFragment(new FvcCounterMain());
      return [ view ];
    }
    default:
      return [];
    }
  }

  createPageOptionalViews(pageId: string): View[] {
    switch (pageId) {
    case PseudoComposer.T_CONFIG.QUEUE.ID: {
      let view = new View();
      view.setContentFragment(new FvcQueueSide());
      return [ view ];
    }
    default:
      return [];
    }
  }

  getBannerFragment(): Fragment | null { return null; }
  getNPageNotifications(_pageId: string): number { return 0; }
}
