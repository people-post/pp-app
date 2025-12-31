import { ServerDataObject } from './ServerDataObject.js';
import { ProductServiceTimeslot } from './ProductServiceTimeslot.js';

export class ProductServiceLocation extends ServerDataObject {
  constructor(data) {
    super(data);
    this._timeslots = [];
    if (data.time_slots) {
      for (let s of data.time_slots) {
        this._timeslots.push(this.#initTimeslot(s));
      }
    }
  }

  getBranchId() { return this._data.branch_id; }
  getAssignee() { return this._data.assignee; }
  getTimeslots() { return this._timeslots; }
  getTimeOverhead() { return this._data.time_overhead; }
  getPriceOverhead() { return this._data.price_overhead; }

  appendTimeslot(ts) { this._timeslots.push(ts); }
  setTimeOverhead(t) { this._data.time_overhead = t; }
  setPriceOverhead(p) { this._data.price_overhead = p; }
  setBranchId(id) { this._data.branch_id = id; }

  estimateNAvailable(t) {
    let n = 0;
    for (let ts of this.getTimeslots()) {
      n += ts.estimateNAvailable(t, this._data.time_overhead);
    }
    return n;
  }

  toApiPostObj() {
    let tss = [];
    for (let ts of this._timeslots) {
      tss.push(ts.toApiPostObj());
    }
    return {
      "time_slots" : tss,
      "time_overhead" : this._data.time_overhead,
      "branch_id" : this._data.branch_id,
      "price_overhead" : this._data.price_overhead
    };
  }

  #initTimeslot(data) { return new ProductServiceTimeslot(data); }
};


