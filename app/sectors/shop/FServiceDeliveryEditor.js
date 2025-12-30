import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcSimpleFragmentList } from '../../lib/ui/controllers/fragments/FvcSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FServiceDeliveryEditor extends shop.FProductDeliveryEditor {
  constructor() {
    super();
    this._fBtnAdd = new Button();
    this._fBtnAdd.setName("+New service location...");
    this._fBtnAdd.setDelegate(this);
    this.setChild("add", this._fBtnAdd);

    this._fLocations = new FSimpleFragmentList();
    this.setChild("locations", this._fLocations);

    this._fLocationOk = new Button();
    this._fLocationOk.setName("OK");
    this._fLocationOk.setDelegate(this);

    this._fLocationEditor = new shop.FServiceLocationEditor();
    this._fLocationEditor.setDelegate(this);

    this._vLocation = new View();
    let f = new FvcSimpleFragmentList();
    f.append(this._fLocationEditor);
    f.append(this._fLocationOk);
    this._vLocation.setContentFragment(f);

    this._fCurrentLocation = null;
  }

  shouldServiceLocationFragmentHighlight(fLocation) { return false; }

  onClickInServiceLocationFragment(fLocation) {
    this._fCurrentLocation = fLocation;
    this.#onEditLocation(fLocation.getData());
  }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn) {
    case this._fBtnAdd:
      this.#onAddLocation();
      break;
    case this._fLocationOk:
      this.#onLocationOk();
      break;
    default:
      break;
    }
  }

  setValue(value) {
    super.setValue(value);
    this._fLocations.clear();
    for (let l of value.getLocations()) {
      this.#addLocation(l);
    }
  }

  _getType() { return dat.ProductDeliveryChoice.TYPE.QUEUE; }

  _collectData() {
    let ls = [];
    for (let f of this._fLocations.getChildren()) {
      ls.push(f.getData().toApiPostObj());
    }
    return {"locations" : ls, "description" : "TEMP"};
  }

  _renderSpec(panel) {
    let p = new ListPanel();
    panel.wrapPanel(p);
    let pp = new PanelWrapper();
    pp.setClassName("pad5px");
    p.pushPanel(pp);
    this._fLocations.attachRender(pp);
    this._fLocations.render();

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fBtnAdd.attachRender(pp);
    this._fBtnAdd.render();
  }

  #onAddLocation() {
    this._fCurrentLocation = null;
    this.#onEditLocation(null);
  }

  #onEditLocation(l) {
    this._fLocationEditor.setData(l);

    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, this._vLocation,
                                "Add location");
  }

  #onLocationOk() {
    let l = this._fLocationEditor.collectData();
    if (this._fCurrentLocation) {
      this._fCurrentLocation.setData(l);
    } else {
      this._fCurrentLocation = null;
      this.#addLocation(l);
    }

    fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
    this._fLocations.render();
  }

  #addLocation(l) {
    let f = new shop.FServiceLocation();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setData(l);

    this._fLocations.append(f);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FServiceDeliveryEditor = FServiceDeliveryEditor;
}
