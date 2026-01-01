import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { T_DATA } from '../../common/plt/Events.js';
import { api } from '../../common/plt/Api.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FServiceLocationFilter } from './FServiceLocationFilter.js';
import { FQueueStatusMessage } from './FQueueStatusMessage.js';

export class FvcQueueCheckin extends FScrollViewContent {
  constructor() {
    super();
    this._fFilter = new FServiceLocationFilter();
    this._fFilter.setUseCurrentTime(true);
    this._fFilter.setDelegate(this);
    this.setChild("filter", this._fFilter);

    this._fBtn = new Button();
    this._fBtn.setName("Checkin");
    this._fBtn.setDelegate(this);
    this._fBtn.setEnabled(false);
    this.setChild("btn", this._fBtn);

    this._fMsg = new FQueueStatusMessage();
    this.setChild("hint", this._fMsg);

    this._selectedLocation = null;
    this._productId = null;
  }

  setData(productId, locations) {
    this._productId = productId;
    this._fFilter.setLocations(locations);
  }

  onSimpleButtonClicked(fBtn) { this.#onCheckin(); }
  onLocationSelectedInServiceLocationFilterFragment(fFilter, loc) {
    this._selectedLocation = loc;
    if (loc) {
      dba.Shop.asyncQueryQueueSize(loc.getBranchId(), this._productId);
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.SERVICE_QUEUE_SIZE:
      this.#onQueueSizeUpdate(data);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let panel = new ListPanel();
    render.wrapPanel(panel);
    let p = new PanelWrapper();
    panel.pushPanel(p);
    this._fFilter.attachRender(p);
    this._fFilter.render();

    p = new PanelWrapper();
    panel.pushPanel(p);
    this._fBtn.attachRender(p);
    this._fBtn.render();

    p = new PanelWrapper();
    p.setClassName("center-align");
    panel.pushPanel(p);
    this._fMsg.attachRender(p);
    this._fMsg.render();
  }

  #onQueueSizeUpdate(n) {
    if (this._selectedLocation) {
      let nTotal = this._selectedLocation.estimateNAvailable(Date.now() / 1000);
      this._fMsg.updateStatus(n, nTotal);
      // Check queue overflow before enable
      if (n < nTotal) {
        this._fBtn.setEnabled(true);
      }
    } else {
      this._fMsg.clearStatus();
    }
  }

  #onCheckin() {
    if (dba.Account.isAuthenticated()) {
      this.#asyncCheckin();
    } else {
      // Guest
      let v = new View();
      let fvc = new S.hr.FvcUserInput();
      let fName = new TextInput();
      fName.setConfig({
        title : R.get("GUEST_NICKNAME_PROMPT"),
        hint : "Nickname",
        value : dba.Account.getGuestName(),
        isRequired : true
      });
      fvc.addInputCollector(fName);

      let fContact = new TextInput();
      fContact.setConfig({
        title : R.get("GUEST_CONTACT_PROMPT"),
        hint : "Contact",
        value : dba.Account.getGuestContact(),
        isRequired : true
      });
      fvc.addInputCollector(fContact);

      fvc.setConfig({
        fcnValidate : () => fName.validate() && fContact.validate(),
        fcnOK : () => this.#asyncCheckin(fName.getValue(), fContact.getValue()),
      });
      v.setContentFragment(fvc);
      Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                  "Guest info", false);
    }
  }

  #asyncCheckin(name = null, contact = null) {
    let url = "api/shop/checkin";
    let fd = new FormData();
    fd.append("branch_id", this._selectedLocation.getBranchId());
    fd.append("product_id", this._productId);
    if (name && name.length) {
      fd.append("customer_name", name);
    }
    if (contact && contact.length) {
      fd.append("customer_contact", contact);
    }
    api.asyncFragmentPost(this, url, fd).then(d => this.#onCheckinRRR(d));
  }

  #onCheckinRRR(data) { this._owner.onContentFragmentRequestPopView(this); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcQueueCheckin = FvcQueueCheckin;
}
