import { View } from '../../lib/ui/controllers/views/View.js';
import { ICON } from '../../common/constants/Icons.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { FTimeClock } from './FTimeClock.js';
import { FvcLibrary } from './FvcLibrary.js';
import { FvcInteractive } from './FvcInteractive.js';
import { FvcReport } from './FvcReport.js';
import { FvcConfig } from './FvcConfig.js';
import { FvcInstructor } from './FvcInstructor.js';
import { FvcResultShow } from './FvcResultShow.js';
import { R } from '../../common/constants/R.js';

export class Gateway extends SectorGateway {
  static T_CONFIG = {
    LIBRARY : {ID : "LIBRARY", NAME: "Library", ICON: ICON.LIBRARY},
    INTERACTIVE: {ID: "INTERACTIVE", NAME: "Interactive", ICON: ICON.TEST},
    REPORT: {ID: "REPORT", NAME: "Report", ICON: ICON.CLOCK},
    CONFIG: {ID: "CONFIG", NAME: "Config", ICON: ICON.CONFIG},
    INSTRUCTOR: {ID: "INSTRUCTOR", NAME: "Instructor", ICON: ICON.EMPLOYEE},
    RESULT_SHOW: {ID: "RESULT_SHOW", NAME: "Result", ICON: ICON.PRODUCT},
  };

  isLoginRequired() { return true; }

  getIcon() { return ICON.SCHOOL; }
  getDefaultPageId() { return this.constructor.T_CONFIG.LIBRARY.ID; }
  getBannerFragment() { return new FTimeClock(); }
  getPageConfigs() {
    return [
      Gateway.T_CONFIG.LIBRARY, Gateway.T_CONFIG.INTERACTIVE,
      Gateway.T_CONFIG.RESULT_SHOW, Gateway.T_CONFIG.REPORT,
      Gateway.T_CONFIG.CONFIG
    ];
  }

  createPageEntryViews(pageId) {
    let fs = [];
    switch (pageId) {
    case this.constructor.T_CONFIG.LIBRARY.ID:
      fs = [ new FvcLibrary() ];
      break;
    case this.constructor.T_CONFIG.INTERACTIVE.ID:
      fs = [ new FvcInteractive() ];
      break;
    case this.constructor.T_CONFIG.REPORT.ID:
      fs = [ new FvcReport() ];
      break;
    case this.constructor.T_CONFIG.CONFIG.ID:
      fs = [ new FvcConfig() ];
      break;
    case this.constructor.T_CONFIG.INSTRUCTOR.ID:
      fs = [ new FvcInstructor() ];
      break;
    case this.constructor.T_CONFIG.RESULT_SHOW.ID:
      fs = [ new FvcResultShow() ];
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
