
const _CPT_PRODUCT_EDITOR = {
  MAIN : `<div class="product">
  <div id="__ID_NAME__"></div>
  <div id="__ID_FILES__"></div>
  <div id="__ID_DESCRIPTION__"></div>
  <br>
  <div id="__ID_MENU_TAGS__"></div>
  <br>
  <div id="__ID_PRICE__"></div>
  <br>
  <div id="__ID_DELIVERY__"></div>
  <br>
  <div id="__ID_ACTIONS__"></div>
  <br>
  </div>`,
} as const;
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';

export class PProductEditor extends Panel {
  protected _pName: Panel;
  protected _pFiles: PanelWrapper;
  protected _pDescription: PanelWrapper;
  protected _pMenuTags: SectionPanel;
  protected _pPrice: PanelWrapper;
  protected _pDelivery: PanelWrapper;
  protected _pActions: Panel;

  constructor() {
    super();
    this._pName = new Panel();
    this._pFiles = new PanelWrapper();
    this._pDescription = new PanelWrapper();
    this._pMenuTags = new SectionPanel("Menu tags");
    this._pPrice = new PanelWrapper();
    this._pDelivery = new PanelWrapper();
    this._pActions = new Panel();
  }

  getNamePanel(): Panel { return this._pName; }
  getFilesPanel(): PanelWrapper { return this._pFiles; }
  getDescriptionPanel(): PanelWrapper { return this._pDescription; }
  getMenuTagsPanel(): Panel | null { return this._pMenuTags.getContentPanel(); }
  getPricePanel(): PanelWrapper { return this._pPrice; }
  getDeliveryPanel(): PanelWrapper { return this._pDelivery; }
  getActionsPanel(): Panel { return this._pActions; }

  _renderFramework(): string {
    let s = _CPT_PRODUCT_EDITOR.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_FILES__", this._getSubElementId("F"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_MENU_TAGS__", this._getSubElementId("M"));
    s = s.replace("__ID_PRICE__", this._getSubElementId("P"));
    s = s.replace("__ID_DELIVERY__", this._getSubElementId("DL"));
    s = s.replace("__ID_ACTIONS__", this._getSubElementId("A"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pFiles.attach(this._getSubElementId("F"));
    this._pDescription.attach(this._getSubElementId("D"));
    this._pMenuTags.attach(this._getSubElementId("M"));
    this._pPrice.attach(this._getSubElementId("P"));
    this._pDelivery.attach(this._getSubElementId("DL"));
    this._pActions.attach(this._getSubElementId("A"));
  }
}
