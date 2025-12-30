
export class Gateway extends plt.SectorGateway {
  static T_CONFIG = {
    LIBRARY : {ID : "LIBRARY", NAME: "Library", ICON: C.ICON.LIBRARY},
    INTERACTIVE: {ID: "INTERACTIVE", NAME: "Interactive", ICON: C.ICON.TEST},
    REPORT: {ID: "REPORT", NAME: "Report", ICON: C.ICON.CLOCK},
    CONFIG: {ID: "CONFIG", NAME: "Config", ICON: C.ICON.CONFIG},
    INSTRUCTOR: {ID: "INSTRUCTOR", NAME: "Instructor", ICON: C.ICON.EMPLOYEE},
    RESULT_SHOW: {ID: "RESULT_SHOW", NAME: "Result", ICON: C.ICON.PRODUCT},
  };

  isLoginRequired() { return true; }

  getIcon() { return C.ICON.SCHOOL; }
  getDefaultPageId() { return this.constructor.T_CONFIG.LIBRARY.ID; }
  getBannerFragment() { return new scol.FTimeClock(); }
  getPageConfigs() {
    return [
      scol.Gateway.T_CONFIG.LIBRARY, scol.Gateway.T_CONFIG.INTERACTIVE,
      scol.Gateway.T_CONFIG.RESULT_SHOW, scol.Gateway.T_CONFIG.REPORT,
      scol.Gateway.T_CONFIG.CONFIG
    ];
  }

  createPageEntryViews(pageId) {
    let fs = [];
    switch (pageId) {
    case this.constructor.T_CONFIG.LIBRARY.ID:
      fs = [ new scol.FvcLibrary() ];
      break;
    case this.constructor.T_CONFIG.INTERACTIVE.ID:
      fs = [ new scol.FvcInteractive() ];
      break;
    case this.constructor.T_CONFIG.REPORT.ID:
      fs = [ new scol.FvcReport() ];
      break;
    case this.constructor.T_CONFIG.CONFIG.ID:
      fs = [ new scol.FvcConfig() ];
      break;
    case this.constructor.T_CONFIG.INSTRUCTOR.ID:
      fs = [ new scol.FvcInstructor() ];
      break;
    case this.constructor.T_CONFIG.RESULT_SHOW.ID:
      fs = [ new scol.FvcResultShow() ];
      break;
    default:
      break;
    }
import { View } from '../../lib/ui/controllers/views/View.js';

export class Gateway extends plt.SectorGateway {
  static T_CONFIG = {
    LIBRARY : {ID : "LIBRARY", NAME: "Library", ICON: C.ICON.LIBRARY},
    INTERACTIVE: {ID: "INTERACTIVE", NAME: "Interactive", ICON: C.ICON.TEST},
    REPORT: {ID: "REPORT", NAME: "Report", ICON: C.ICON.CLOCK},
    CONFIG: {ID: "CONFIG", NAME: "Config", ICON: C.ICON.CONFIG},
    INSTRUCTOR: {ID: "INSTRUCTOR", NAME: "Instructor", ICON: C.ICON.EMPLOYEE},
    RESULT_SHOW: {ID: "RESULT_SHOW", NAME: "Result", ICON: C.ICON.PRODUCT},
  };

  isLoginRequired() { return true; }

  getIcon() { return C.ICON.SCHOOL; }
  getDefaultPageId() { return this.constructor.T_CONFIG.LIBRARY.ID; }
  getBannerFragment() { return new scol.FTimeClock(); }
  getPageConfigs() {
    return [
      scol.Gateway.T_CONFIG.LIBRARY, scol.Gateway.T_CONFIG.INTERACTIVE,
      scol.Gateway.T_CONFIG.RESULT_SHOW, scol.Gateway.T_CONFIG.REPORT,
      scol.Gateway.T_CONFIG.CONFIG
    ];
  }

  createPageEntryViews(pageId) {
    let fs = [];
    switch (pageId) {
    case this.constructor.T_CONFIG.LIBRARY.ID:
      fs = [ new scol.FvcLibrary() ];
      break;
    case this.constructor.T_CONFIG.INTERACTIVE.ID:
      fs = [ new scol.FvcInteractive() ];
      break;
    case this.constructor.T_CONFIG.REPORT.ID:
      fs = [ new scol.FvcReport() ];
      break;
    case this.constructor.T_CONFIG.CONFIG.ID:
      fs = [ new scol.FvcConfig() ];
      break;
    case this.constructor.T_CONFIG.INSTRUCTOR.ID:
      fs = [ new scol.FvcInstructor() ];
      break;
    case this.constructor.T_CONFIG.RESULT_SHOW.ID:
      fs = [ new scol.FvcResultShow() ];
      break;
    default:
      break;
    }
    let vs = [];
    for (let f of fs) {
      let v = new View();
      v.setContentFragment(f);
      vs.push(v);
    }
    return vs;
  }

  #makeTabConfig(c) {
    return {name : R.t(c.NAME), value : c.ID, icon : c.ICON};
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.scol = window.scol || {};
  window.scol.Gateway = Gateway;
}
