import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProjectInfoBase extends Panel {
  protected _pTitle: Panel;
  protected _pContent: Panel;
  protected _pImage: PanelWrapper;
  protected _pProgress: PanelWrapper;

  // TODO: Extend from PQuotableBase
  constructor() {
    super();
    this._pTitle = new Panel();
    this._pContent = new Panel();
    this._pImage = new PanelWrapper();
    this._pProgress = new PanelWrapper();
  }

  isColorInvertible(): boolean { return false; }

  getImagePanel(): PanelWrapper { return this._pImage; }
  getTitlePanel(): Panel { return this._pTitle; }
  getContentPanel(): Panel { return this._pContent; }
  getProgressPanel(): PanelWrapper { return this._pProgress; }
  getUserIconPanel(): Panel | null { return null; }
  getUserNamePanel(): Panel | null { return null; }
  getReferencePanel(): Panel | null { return null; }
  getCreationTimeSmartPanel(): Panel | null { return null; }
  getSocialBarPanel(): Panel | null { return null; }
  getProgressDirection(): string { return "H"; }

  setVisibilityClassName(_name: string): void {}
  enableImage(): void {}
  invertColor(): void {}
}
