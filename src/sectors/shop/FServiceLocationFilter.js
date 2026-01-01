import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FServiceLocation } from './FServiceLocation.js';

export class FServiceLocationFilter extends Fragment {
  constructor() {
    super();
    this._fAllLocations = [];
    this._shouldUseCurrentTime = false;

    this._fLocations = new FSimpleFragmentList();
    this.setChild("locations", this._fLocations);

    this._fSelected = null;
  }

  shouldServiceLocationFragmentHighlight(fLocation) {
    return this._fSelected == fLocation;
  }

  getSelectedLocationData() { return this._fSelected.getData(); }
  setLocations(ls) {
    this._fAllLocations = [];
    for (let lc of ls) {
      let f = new FServiceLocation();
      f.setDataSource(this);
      f.setDelegate(this);
      f.setData(lc);
      this._fAllLocations.push(f);
    }
  }
  setUseCurrentTime(b) { this._shouldUseCurrentTime = b; }

  onClickInServiceLocationFragment(fLocation) {
    // TODO: Timeslot as well
    if (this._fSelected == fLocation) {
      return;
    }
    this._fSelected = fLocation;
    this.render();
    this._delegate.onLocationSelectedInServiceLocationFilterFragment(
        this, this._fSelected.getData());
  }

  _renderOnRender(render) {
    let panel = new PanelWrapper();
    render.wrapPanel(panel);

    this._fLocations.clear();
    for (let f of this._fAllLocations) {
      if (this._shouldUseCurrentTime) {
        if (f.hasServiceNow()) {
          this._fLocations.append(f);
        }
      } else {
        if (f.hasServiceNowOrLater()) {
          this._fLocations.append(f);
        }
      }
    }
    if (this._fLocations.size() > 0) {
      this._fLocations.attachRender(panel);
      this._fLocations.render();
    } else {
      panel.replaceContent(R.get("NO_SERVICE_LOCATION_AVAILABLE"));
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FServiceLocationFilter = FServiceLocationFilter;
}
