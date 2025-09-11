(function(shop) {
shop.CF_SERVICE_LOCATION = {
  ON_CLICK : Symbol(),
};

class FServiceLocation extends ui.Fragment {
  constructor() {
    super();
    this._fTimeslots = new ui.FSimpleFragmentList();
    this.setChild("timeslots", this._fTimeslots);

    this._fBranch = new shop.FBranch();
    this._fBranch.setDelegate(this);
    this._fBranch.setLayoutType(shop.FBranch.T_LAYOUT.SMALL);
    this.setChild("branch", this._fBranch);

    this._fBtnViewQueue = new shop.FBtnViewQueue();
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
    case shop.CF_SERVICE_LOCATION.ON_CLICK:
      this._delegate.onClickInServiceLocationFragment(this);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let panel = new shop.PServiceLocation();
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
      let f = new shop.FServiceTimeslot();
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

shop.FServiceLocation = FServiceLocation;
}(window.shop = window.shop || {}));
