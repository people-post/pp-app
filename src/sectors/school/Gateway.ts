import { View } from '../../lib/ui/controllers/views/View.js';
import { ICON } from '../../common/constants/Icons.js';
import { SectorGateway, PageConfig } from '../../common/plt/SectorGateway.js';
import { FTimeClock } from './FTimeClock.js';
import { FvcLibrary } from './FvcLibrary.js';
import { FvcInteractive } from './FvcInteractive.js';
import { FvcReport } from './FvcReport.js';
import { FvcConfig } from './FvcConfig.js';
import { FvcInstructor } from './FvcInstructor.js';
import { FvcResultShow } from './FvcResultShow.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class Gateway implements SectorGateway {
  static T_CONFIG = {
    LIBRARY : {ID : "LIBRARY", NAME: "Library", ICON: ICON.LIBRARY},
    INTERACTIVE: {ID: "INTERACTIVE", NAME: "Interactive", ICON: ICON.TEST},
    REPORT: {ID: "REPORT", NAME: "Report", ICON: ICON.CLOCK},
    CONFIG: {ID: "CONFIG", NAME: "Config", ICON: ICON.CONFIG},
    INSTRUCTOR: {ID: "INSTRUCTOR", NAME: "Instructor", ICON: ICON.EMPLOYEE},
    RESULT_SHOW: {ID: "RESULT_SHOW", NAME: "Result", ICON: ICON.PRODUCT},
  } as const;

  isLoginRequired(): boolean { return true; }
  isPageNavItem(_pageId: string): boolean { return false; }
  shouldEnableSessionAction(_pageId: string): boolean { return true; }

  getIcon(): string { return ICON.SCHOOL; }
  getDefaultPageId(): string { return Gateway.T_CONFIG.LIBRARY.ID; }
  getBannerFragment(): Fragment { return new FTimeClock(); }
  getPageConfigs(): PageConfig[] {
    return [
      Gateway.T_CONFIG.LIBRARY, Gateway.T_CONFIG.INTERACTIVE,
      Gateway.T_CONFIG.RESULT_SHOW, Gateway.T_CONFIG.REPORT,
      Gateway.T_CONFIG.CONFIG
    ];
  }

  createPageEntryViews(pageId: string): View[] {
    let fs: Fragment[] = [];
    switch (pageId) {
    case Gateway.T_CONFIG.LIBRARY.ID:
      fs = [ new FvcLibrary() ];
      break;
    case Gateway.T_CONFIG.INTERACTIVE.ID:
      fs = [ new FvcInteractive() ];
      break;
    case Gateway.T_CONFIG.REPORT.ID:
      fs = [ new FvcReport() ];
      break;
    case Gateway.T_CONFIG.CONFIG.ID:
      fs = [ new FvcConfig() ];
      break;
    case Gateway.T_CONFIG.INSTRUCTOR.ID:
      fs = [ new FvcInstructor() ];
      break;
    case Gateway.T_CONFIG.RESULT_SHOW.ID:
      fs = [ new FvcResultShow() ];
      break;
    default:
      break;
    }
    let vs: View[] = [];
    for (let f of fs) {
      let v = new View();
      v.setContentFragment(f);
      vs.push(v);
    }
    return vs;
  }

  getNPageNotifications(_pageId: string): number { return 0; }
  createPageOptionalViews(_pageId: string): View[] { return []; }
}

