import { View } from '../../lib/ui/controllers/views/View.js';
import { ID } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { FvcQueueMain } from '../shop/FvcQueueMain.js';
import { FvcCounterMain } from '../shop/FvcCounterMain.js';
import { FvcQueueSide } from '../shop/FvcQueueSide.js';

export class Gateway extends SectorGateway {
  static T_CONFIG = {
    QUEUE : {ID : ID.SECTOR.QUEUE, NAME: "Queue", ICON: ICON.QUEUE},
    COUNTER: {ID: ID.SECTOR.COUNTER, NAME: "Counter", ICON: ICON.INFO},
  } as const;

  private _sectorId: string;

  constructor(sectorId: string) {
    super();
    this._sectorId = sectorId;
  }

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

  getPageConfigs(): unknown[] {
    let configs: unknown[] = [];
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

  createPageEntryViews(pageId: string): unknown[] {
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

  createPageOptionalViews(pageId: string): unknown[] {
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
};
