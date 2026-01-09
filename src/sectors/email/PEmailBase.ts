import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PEmailBase extends Panel {
  private _pTitle: Panel;
  private _pContent: Panel;
  private _pTime: Panel;
  private _pSender: Panel;

  constructor() {
    super();
    this._pTitle = new Panel();
    this._pContent = new Panel();
    this._pTime = new Panel();
    this._pSender = new Panel();
  }

  isColorInvertible(): boolean { return false; }

  getTitlePanel(): Panel { return this._pTitle; }
  getContentPanel(): Panel { return this._pContent; }
  getTimePanel(): Panel { return this._pTime; }
  getSenderPanel(): Panel { return this._pSender; }
  getReceiverPanel(): Panel | null { return null; }
  getIconPanel(): Panel | null { return null; }
  getCarbonCopyPanel(): Panel | null { return null; }

  invertColor(): void {}
};
