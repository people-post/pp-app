import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class FQueueDelivery extends shop.FServiceDelivery {
  constructor() {
    super();
    this._fBtnCheckin = new Button();
    this._fBtnCheckin.setName("Check in...");
    this._fBtnCheckin.setDelegate(this);
    this.setChild("checkin", this._fBtnCheckin);

    this._fMsg = new shop.FQueueStatusMessage();
    this.setChild("hint", this._fMsg);

    this._productId = null;
  }

  onSimpleButtonClicked(fBtn) { this.#onCheckin(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.SERVICE_QUEUE_SIZE:
      this.#onQueueSizeUpdate(data);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.COMPACT:
      this.#renderCompact(render);
      break;
    default:
      this.#renderFull(render);
      break;
    }
  }

  #renderCompact(render) {
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

  #renderFull(panel) {
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

  _onContentDidAppear() {
    let locs = this._data.getLocations();
    if (locs.length == 1) {
      let product = this._getProduct();
      dba.Shop.asyncQueryQueueSize(locs[0].getBranchId(), product.getId());
    }
  }

  #onQueueSizeUpdate(n) {
    let locs = this._data.getLocations();
    if (locs.length == 1) {
      let nTotal = locs[0].estimateNAvailable(Date.now() / 1000);
      this._fMsg.updateStatus(n, nTotal);
    } else {
      this._fMsg.clearStatus();
    }
  }

  #onCheckin() {
    let v = new View();
    let f = new shop.FvcQueueCheckin();
    let product = this._getProduct();
    f.setData(product.getId(), this._data.getLocations());
    v.setContentFragment(f);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Check in",
                                false);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FQueueDelivery = FQueueDelivery;
}
