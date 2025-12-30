
class Gateway extends plt.SectorGateway {
  static T_CONFIG = {
    QUEUE : {ID : C.ID.SECTOR.QUEUE, NAME: "Queue", ICON: C.ICON.QUEUE},
    COUNTER: {ID: C.ID.SECTOR.COUNTER, NAME: "Counter", ICON: C.ICON.INFO},
  };

  constructor(sectorId) {
    super();
    this._sectorId = sectorId;
  }

  getIcon() {
    let icon;
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

  getDefaultPageId() {
    let id;
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

  getPageConfigs() {
    let configs = [];
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

  createPageEntryViews(pageId) {
    let vs = [];
    switch (pageId) {
    case this.constructor.T_CONFIG.QUEUE.ID:
      vs = [ new ui.View() ];
      vs[0].setContentFragment(new shop.FvcQueueMain());
      break;
    case this.constructor.T_CONFIG.COUNTER.ID:
      vs = [ new ui.View() ];
      vs[0].setContentFragment(new shop.FvcCounterMain());
      break;
    default:
      break;
    }
    return vs;
  }

  createPageOptionalViews(pageId) {
    let vs = [];
    switch (pageId) {
    case this.constructor.T_CONFIG.QUEUE.ID:
      vs = [ new ui.View() ];
      vs[0].setContentFragment(new shop.FvcQueueSide());
      break;
    default:
      break;
    }
    return vs;
  }
};

psud.Gateway = Gateway;
}(window.psud = window.psud || {}));
