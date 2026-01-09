export const CF_SERVICE_LOCATION = {
  ON_CLICK : Symbol(),
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FBranch } from './FBranch.js';
import { FBtnViewQueue } from './FBtnViewQueue.js';
import { PServiceLocation } from './PServiceLocation.js';
import { FServiceTimeslot } from './FServiceTimeslot.js';

interface ServiceLocationData {
  getTimeslots(): Array<{ contains: (t: number) => boolean; isAfter: (t: number) => boolean }>;
  getBranchId(): string;
  getPriceOverhead(): number;
  getTimeOverhead(): number;
}

interface ServiceLocationDataSource {
  shouldServiceLocationFragmentHighlight(f: FServiceLocation): boolean;
}

export class FServiceLocation extends Fragment {
  protected _fTimeslots: FSimpleFragmentList;
  protected _fBranch: FBranch;
  protected _fBtnViewQueue: FBtnViewQueue;
  protected _data: ServiceLocationData | null = null;
  protected _dataSource!: ServiceLocationDataSource;

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
  }

  hasServiceNow(): boolean {
    if (!this._data) return false;
    let tSec = Date.now() / 1000;
    for (let ts of this._data.getTimeslots()) {
      if (ts.contains(tSec)) {
        return true;
      }
    }
    return false;
  }
  hasServiceNowOrLater(): boolean {
    if (!this._data) return false;
    let tSec = Date.now() / 1000;
    for (let ts of this._data.getTimeslots()) {
      if (ts.isAfter(tSec)) {
        return true;
      }
    }
    return false;
  }

  getData(): ServiceLocationData | null { return this._data; }

  setData(d: ServiceLocationData): void {
    this._data = d;
    this._fBtnViewQueue.setBranchId(d.getBranchId());
  }

  onClickInBranchFragment(_fBranch: FBranch, _branchId: string): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onClickInServiceLocationFragment?.(this);
  }
  onBranchFragmentRequestShowView(_fBranch: FBranch, _view: unknown, _title: string): void {}

  action(type: symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_SERVICE_LOCATION.ON_CLICK:
      // @ts-expect-error - delegate may have this method
      this._delegate?.onClickInServiceLocationFragment?.(this);
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderOnRender(render: any): void {
    if (!this._data) return;
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
}
