import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { FrontPageConfig } from '../../common/datatypes/FrontPageConfig.js';
import { FvcJournal } from './FvcJournal.js';
import { FvcBrief } from './FvcBrief.js';
import { FvcBlockchain } from './FvcBlockchain.js';
import { glb } from '../../lib/framework/Global.js';
import { Env } from '../../common/plt/Env.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment() {
    if (window.dba.Account.isAuthenticated()) {
      if (window.dba.Account.isWebOwner()) {
        return this._createMainViewContentFragmentForOwner();
      } else {
        return this._createMainViewContentFragmentForVisitor();
      }
    } else {
      return this._createMainViewContentFragmentForGuest();
    }
  }

  _createMainViewContentFragmentForGuest() {
    let f;
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

  _createMainViewContentFragmentForVisitor() {
    return this._createMainViewContentFragmentForGuest();
  }

  _createMainViewContentFragmentForOwner() {
    return this._createMainViewContentFragmentForGuest();
  }
};
