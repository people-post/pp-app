export const CF_SERVICE_LOCATION = {
  ON_CLICK : Symbol(),
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FBranch } from './FBranch.js';
import { FBtnViewQueue } from './FBtnViewQueue.js';
import { PServiceLocation } from './PServiceLocation.js';
import { FServiceTimeslot } from './FServiceTimeslot.js';

export class FServiceLocation extends Fragment {
  constructor() {
    super();
    this._fTimeslots = new FSimpleFragmentList();
    this.setChild("timeslots", this._fTimeslots);

    this._fBranch = new FBranch();
    this._fBranch.setDelegate(this);
    this._fBranch.setLayoutType(FBranch.T_LAYOUT.SMALL);
    this.setChild("branch", this._fBranch);

    this._fBtnViewQueue = new FBtnViewQueue();
    this.setChild("viewQueue", this._fBtnViewQueue);

    this._data = null;
  }

  hasServiceNow() {
    let tSec = Date.now() / 1000;
    for (let ts of this._data.getTimeslots()) {
      if (ts.contains(tSec)) {
        return true;
      }
    }
    return false;
  }
  hasServiceNowOrLater() {
    let tSec = Date.now() / 1000;
    for (let ts of this._data.getTimeslots()) {
      if (ts.isAfter(tSec)) {
        return true;
      }
    }
    return false;
  }

  getData() { return this._data; }

  setData(d) {
    this._data = d;
    this._fBtnViewQueue.setBranchId(d.getBranchId());
  }

  onClickInBranchFragment(fBranch, branchId) {
    this._delegate.onClickInServiceLocationFragment(this);
  }
  onBranchFragmentRequestShowView(fBranch, view, title) {}

  action(type, ...args) {
    switch (type) {
    case CF_SERVICE_LOCATION.ON_CLICK:
      this._delegate.onClickInServiceLocationFragment(this);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let panel = new PServiceLocation();
    render.wrapPanel(panel);

    panel.setAttribute(
        "onclick", "javascript:G.action(shop.CF_SERVICE_LOCATION.ON_CLICK)");
    if (this._dataSource.shouldServiceLocationFragmentHighlight(this)) {
      panel.invertColor();
    }

    let p = panel.getPriceOverheadPanel();
    p.replaceContent("PriceOverhead: " + this._data.getPriceOverhead());

    p = panel.getTimeOverheadPanel();
    p.replaceContent("TimeOverhead: " + this._data.getTimeOverhead());

    p = panel.getAddressPanel();
    this._fBranch.attachRender(p);
    this._fBranch.setBranchId(this._data.getBranchId());
    this._fBranch.render();

    p = panel.getTimeslotsPanel();
    this._fTimeslots.clear();
    for (let ts of this._data.getTimeslots()) {
      let f = new FServiceTimeslot();
      f.setData(ts);
      this._fTimeslots.append(f);
    }
    this._fTimeslots.attachRender(p);
    this._fTimeslots.render();

    p = panel.getViewQueueBtnPanel();
    this._fBtnViewQueue.attachRender(p);
    this._fBtnViewQueue.render();
  }
};
