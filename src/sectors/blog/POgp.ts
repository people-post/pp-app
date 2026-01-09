import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class POgp extends Panel {
  protected _pAuthor: PanelWrapper;
  protected _pTime: Panel;
  protected _pImage: PanelWrapper;
  protected _pTitle: Panel;
  protected _pDescription: Panel;

  constructor() {
    super();
    this._pAuthor = new PanelWrapper();
    this._pTime = new Panel();
    this._pImage = new PanelWrapper();
    this._pTitle = new Panel();
    this._pDescription = new Panel();
  }

  getAuthorPanel(): PanelWrapper { return this._pAuthor; }
  getCreationTimeSmartPanel(): Panel { return this._pTime; }
  getImagePanel(): PanelWrapper { return this._pImage; }
  getTitlePanel(): Panel { return this._pTitle; }
  getDescriptionPanel(): Panel { return this._pDescription; }

  _renderFramework(): string {
    let s = this._getTemplate();
    s = s.replace("__ID_AUTHOR__", this._getSubElementId("AU"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("IMG"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    this._pAuthor.attach(this._getSubElementId("AU"));
    this._pTime.attach(this._getSubElementId("TM"));
    this._pImage.attach(this._getSubElementId("IMG"));
    this._pTitle.attach(this._getSubElementId("TT"));
    this._pDescription.attach(this._getSubElementId("C"));
  }

  _getTemplate(): string { return ""; }
}
