
export class FvcQueueCheckin extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fFilter = new shop.FServiceLocationFilter();
    this._fFilter.setUseCurrentTime(true);
    this._fFilter.setDelegate(this);
    this.setChild("filter", this._fFilter);

    this._fBtn = new ui.Button();
    this._fBtn.setName("Checkin");
    this._fBtn.setDelegate(this);
    this._fBtn.setEnabled(false);
    this.setChild("btn", this._fBtn);

    this._fMsg = new shop.FQueueStatusMessage();
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
    case plt.T_DATA.SERVICE_QUEUE_SIZE:
      this.#onQueueSizeUpdate(data);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let panel = new ui.ListPanel();
    render.wrapPanel(panel);
    let p = new ui.PanelWrapper();
    panel.pushPanel(p);
    this._fFilter.attachRender(p);
    this._fFilter.render();

    p = new ui.PanelWrapper();
    panel.pushPanel(p);
    this._fBtn.attachRender(p);
    this._fBtn.render();

    p = new ui.PanelWrapper();
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
      let v = new ui.View();
      let fvc = new S.hr.FvcUserInput();
      let fName = new ui.TextInput();
      fName.setConfig({
        title : R.get("GUEST_NICKNAME_PROMPT"),
        hint : "Nickname",
        value : dba.Account.getGuestName(),
        isRequired : true
      });
      fvc.addInputCollector(fName);

      let fContact = new ui.TextInput();
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
      fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
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
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onCheckinRRR(d));
  }

  #onCheckinRRR(data) { this._owner.onContentFragmentRequestPopView(this); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcQueueCheckin = FvcQueueCheckin;
}
