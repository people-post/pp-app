import { SectorGateway, PageConfig } from '../../common/plt/SectorGateway.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { FrontPageConfig } from '../../common/datatypes/FrontPageConfig.js';
import { FvcJournal } from './FvcJournal.js';
import { FvcBrief } from './FvcBrief.js';
import { FvcBlockchain } from './FvcBlockchain.js';
import { Env } from '../../common/plt/Env.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Account } from '../../common/dba/Account.js';

export class Gateway implements SectorGateway {
  isLoginRequired(): boolean { return false; }
  isPageNavItem(_pageId: string): boolean { return false; }
  shouldEnableSessionAction(_pageId: string): boolean { return true; }
  getIcon(): string | null { return null; }
  getDefaultPageId(): string | null { return null; }
  getBannerFragment(): Fragment | null { return null; }
  getPageConfigs(): PageConfig[] { return []; }
  getNPageNotifications(_pageId: string): number { return 0; }
  createPageEntryViews(_pageId: string): View[] { return []; }
  createPageOptionalViews(_pageId: string): View[] { return []; }
  createMainViewContentFragment(): Fragment {
    if (Account.isAuthenticated()) {
      if (Account.isWebOwner()) {
        return this._createMainViewContentFragmentForOwner();
      } else {
        return this._createMainViewContentFragmentForVisitor();
      }
    } else {
      return this._createMainViewContentFragmentForGuest();
    }
  }

  _createMainViewContentFragmentForGuest(): Fragment {
    let f: Fragment;
    let c = WebConfig.getFrontPageConfig();
    switch (c.getTemplateId()) {
    case FrontPageConfig.T_TEMPLATE.JOURNAL:
      f = new FvcJournal();
      f.setConfig(c.getTemplateConfig(), c.getLayoutConfig());
      break;
    case FrontPageConfig.T_TEMPLATE.BRIEF:
      // Hack
      Env.setSmartTimeDiffThreshold(24 * 3600);

      f = new FvcBrief();
      f.setOwnerId(WebConfig.getOwnerId());
      f.setConfig(c.getTemplateConfig());
      break;
    case FrontPageConfig.T_TEMPLATE.BLOCKCHAIN:
      f = new FvcBlockchain();
      break;
    default:
      // Default to brief
      f = new FvcBrief();
      f.setOwnerId(WebConfig.getOwnerId());
      break;
    }
    return f;
  }

  _createMainViewContentFragmentForVisitor(): Fragment {
    return this._createMainViewContentFragmentForGuest();
  }

  _createMainViewContentFragmentForOwner(): Fragment {
    return this._createMainViewContentFragmentForGuest();
  }
};
