import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FServiceDelivery } from './FServiceDelivery.js';
import { FQueueStatusMessage } from './FQueueStatusMessage.js';
import { FvcQueueCheckin } from './FvcQueueCheckin.js';
import { Shop } from '../../common/dba/Shop.js';
import type Render from '../../lib/ui/renders/Render.js';

interface ServiceDeliveryData {
  getLocations(): Array<{ getBranchId(): string; estimateNAvailable(t: number): number }>;
}

export class FQueueDelivery extends FServiceDelivery {
  protected _fBtnCheckin: Button;
  protected _fMsg: FQueueStatusMessage;
  protected _productId: string | null = null;
  protected _data!: ServiceDeliveryData;

  constructor() {
    super();
    this._fBtnCheckin = new Button();
    this._fBtnCheckin.setName("Check in...");
    this._fBtnCheckin.setDelegate(this);
    this.setChild("checkin", this._fBtnCheckin);

    this._fMsg = new FQueueStatusMessage();
    this.setChild("hint", this._fMsg);
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onCheckin(); }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.SERVICE_QUEUE_SIZE:
      this.#onQueueSizeUpdate(data as number);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.COMPACT:
      this.#renderCompact(render);
      break;
    default:
      this.#renderFull(render);
      break;
    }
  }

  #renderCompact(render: Render): void {
    let pMain = new ListPanel();
    render.wrapPanel(pMain);

    let p = new PanelWrapper();
    p.setClassName("center-align");
    pMain.pushPanel(p);
    this._fBtnCheckin.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fBtnCheckin.attachRender(p);
    this._fBtnCheckin.render();

    p = new PanelWrapper();
    p.setClassName("center-align");
    pMain.pushPanel(p);
    this._fMsg.attachRender(p);
    this._fMsg.render();
  }

  #renderFull(panel: Render): void {
    let pMain = new ListPanel();
    panel.wrapPanel(pMain);

    let p = new PanelWrapper();
    pMain.pushPanel(p);
    this._fBtnCheckin.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this._fBtnCheckin.attachRender(p);
    this._fBtnCheckin.render();

    p = new PanelWrapper();
    p.setClassName("center-align");
    pMain.pushPanel(p);
    this._fMsg.attachRender(p);
    this._fMsg.render();
  }

  _onContentDidAppear(): void {
    let locs = this._data.getLocations();
    if (locs.length == 1) {
      let product = this._getProduct();
      if (product) {
        Shop.asyncQueryQueueSize(locs[0].getBranchId(), product.getId());
      }
    }
  }

  #onQueueSizeUpdate(n: number): void {
    let locs = this._data.getLocations();
    if (locs.length == 1) {
      let nTotal = locs[0].estimateNAvailable(Date.now() / 1000);
      this._fMsg.updateStatus(n, nTotal);
    } else {
      this._fMsg.clearStatus();
    }
  }

  #onCheckin(): void {
    let v = new View();
    let f = new FvcQueueCheckin();
    let product = this._getProduct();
    if (product) {
      f.setData(product.getId(), this._data.getLocations());
      v.setContentFragment(f);
      Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Check in",
                                  false);
    }
  }
}
