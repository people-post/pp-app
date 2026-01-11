import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FServiceLocationFilter } from './FServiceLocationFilter.js';
import { FQueueStatusMessage } from './FQueueStatusMessage.js';
import { Shop } from '../../common/dba/Shop.js';
import { FvcUserInput } from '../../common/hr/FvcUserInput.js';
import { R } from '../../common/constants/R.js';
import { Api } from '../../common/plt/Api.js';
import { ServiceLocation } from '../../common/datatypes/ServiceLocation.js';
import { Account } from '../../common/dba/Account.js';

export class FvcQueueCheckin extends FScrollViewContent {
  private _fFilter: FServiceLocationFilter;
  private _fBtn: Button;
  private _fMsg: FQueueStatusMessage;
  private _selectedLocation: ServiceLocation | null = null;
  private _productId: string | null = null;

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

  setData(productId: string, locations: ServiceLocation[]): void {
    this._productId = productId;
    this._fFilter.setLocations(locations);
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onCheckin(); }
  onLocationSelectedInServiceLocationFilterFragment(_fFilter: FServiceLocationFilter, loc: ServiceLocation | null): void {
    this._selectedLocation = loc;
    if (loc && this._productId) {
      Shop.asyncQueryQueueSize(loc.getBranchId(), this._productId);
    }
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.SERVICE_QUEUE_SIZE:
      this.#onQueueSizeUpdate(data as number);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
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

  #onQueueSizeUpdate(n: number): void {
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

  #onCheckin(): void {
    if (Account.isAuthenticated()) {
      this.#asyncCheckin();
    } else {
      // Guest
      let v = new View();
      let fvc = new FvcUserInput();
      let fName = new TextInput();
      fName.setConfig({
        title : R.get("GUEST_NICKNAME_PROMPT"),
        hint : "Nickname",
        value : Account.getGuestName?.() || "",
        isRequired : true
      });
      fvc.addInputCollector(fName);

      let fContact = new TextInput();
      fContact.setConfig({
        title : R.get("GUEST_CONTACT_PROMPT"),
        hint : "Contact",
        value : Account.getGuestContact?.() || "",
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

  #asyncCheckin(name: string | null = null, contact: string | null = null): void {
    if (!this._selectedLocation || !this._productId) return;
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
    Api.asFragmentPost(this, url, fd).then(_d => this.#onCheckinRRR());
  }

  #onCheckinRRR(): void {
    // @ts-expect-error - owner may have this method
    this._owner?.onContentFragmentRequestPopView?.(this);
  }
}

export default FvcQueueCheckin;
