import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PUserInfoBase extends Panel {
  protected _pName: Panel;

  constructor() {
    super();
    this._pName = new Panel();
  }

  getNamePanel(): Panel { return this._pName; }
  getTypeIconPanel(): Panel | null { return null; }
  getUserIdPanel(): Panel | null { return null; }
  getIconPanel(): Panel | null { return null; }
  getDescriptionPanel(): Panel | null { return null; }
}

export default PUserInfoBase;

