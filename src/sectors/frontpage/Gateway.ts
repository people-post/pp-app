import { SectorGateway } from '../../common/plt/SectorGateway.js';
import type { PageConfig } from '../../lib/ui/controllers/PageConfig.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { FrontPageConfig } from '../../common/datatypes/FrontPageConfig.js';
import { JournalPageConfig } from '../../common/datatypes/JournalPageConfig.js';
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
    switch (c?.getTemplateId()) {
    case FrontPageConfig.T_TEMPLATE.JOURNAL:
      {
        let fJournal = new FvcJournal();
        fJournal.setConfig(c.getTemplateConfig() as JournalPageConfig | null, c.getLayoutConfig());
        f = fJournal;
      }
      break;
    case FrontPageConfig.T_TEMPLATE.BRIEF:
      {
        // Hack
        Env.setSmartTimeDiffThreshold(24 * 3600);
        let fBrief = new FvcBrief();
        fBrief.setOwnerId(WebConfig.getOwnerId());
        fBrief.setConfig(c.getTemplateConfig());
        f = fBrief;
      }
      break;
    case FrontPageConfig.T_TEMPLATE.BLOCKCHAIN:
      f = new FvcBlockchain();
      break;
    default:
      {
        // Default to brief
        let fBrief = new FvcBrief();
        fBrief.setOwnerId(WebConfig.getOwnerId());
        f = fBrief;
      }
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
