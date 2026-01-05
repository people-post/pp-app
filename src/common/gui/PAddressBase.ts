import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PAddressBase extends Panel {
  getNicknamePanel(): Panel | null { return null; }
  getNamePanel(): Panel | null { return null; }
  getCountryPanel(): Panel | null { return null; }
  getStatePanel(): Panel | null { return null; }
  getCityPanel(): Panel | null { return null; }
  getZipcodePanel(): Panel | null { return null; }
  getLine1Panel(): Panel | null { return null; }
  getLine2Panel(): Panel | null { return null; }
  getEditBtnPanel(): PanelWrapper | null { return null; }
  getDeleteBtnPanel(): PanelWrapper | null { return null; }
}

