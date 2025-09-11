(function(dat) {
class ProductServiceTimeslot extends dat.ServerDataObject {
  // All time values are timestamp in seconds
  static T_REP = {
    ONCE : "ONCE",
    DAY: "DAY",
    DAY2: "DAY2",
    WEEK: "WEEK",
    WEEK2: "WEEK2",
    MONTH: "MONTH"
  };

  isAfter(t) {
    if (this._data.repetition == this.constructor.T_REP.ONCE) {
      return t < this._data.to;
    } else {
      // Currently no end date, so ok.
      return true;
    }
  }
  getFromTime() { return this._data.from; }
  getToTime() { return this._data.to; }
  getTotal() { return this._data.n; }
  getRepetition() { return this._data.repetition; }

  setFromTime(t) { this._data.from = t; }
  setToTime(t) { this._data.to = t; }
  setTotal(n) { this._data.n = n; }
  setRepetition(r) { this._data.repetition = r; }

  toApiPostObj() {
    return {
      "from" : this._data.from,
      "to" : this._data.to,
      "n" : this._data.n,
      "rep" : this._data.repetition
    };
  }

  estimateNAvailable(t, tOverhead) {
    let dt = this.#getNearestTimeOffset(t);
    if (dt < 0) {
      return 0;
    }
    let tTotal = this._data.to - this._data.from;
    if (tTotal <= 0) {
      return 0;
    }
    dt = tTotal - dt;
    if (dt < tOverhead) {
      return 0;
    }
    return Math.floor(dt / tTotal * this._data.n);
  }

  contains(t) {
    let dt = this.#getNearestTimeOffset(t);
    return dt > 0 && dt < this._data.to - this._data.from;
  }

  #getNearestTimeOffset(t) {
    if (t < this._data.from) {
      return t - this._data.from;
    }
    // Currently no end date, so no end date check
    let dt = 0;
    switch (this._data.repetition) {
    case this.constructor.T_REP.DAY:
      dt = 3600 * 24;
      break;
    case this.constructor.T_REP.DAY2:
      dt = 3600 * 24 * 2;
      break;
    case this.constructor.T_REP.WEEK:
      dt = 3600 * 24 * 7;
      break;
    case this.constructor.T_REP.WEEK2:
      dt = 3600 * 24 * 7 * 2;
      break;
    case this.constructor.T_REP.MONTH:
      return this.#monthlyGetNearestTimeOffset(t);
    default:
      break;
    }
    if (dt > 0) {
      return (t - this._data.from) % dt;
    } else {
      return t - this._data.from;
    }
  }

  #monthlyGetNearestTimeOffset(t) {
    let tFrom = new Date(this._data.from * 1000);
    let tTo = new Date(this._data.to * 1000);
    let tt = new Date(t * 1000);

    // Normalize to the distance to the first day of month
    let day1 = new Date(tFrom.getFullYear(), tFrom.getMonth());
    let dtFrom = tFrom.valueOf() - day1.valueOf();

    day1 = new Date(tTo.getFullYear(), tTo.getMonth());
    let dtTo = tTo.valueOf() - day1.valueOf();

    day1 = new Date(tt.getFullYear(), tt.getMonth());
    let dt = tt.valueOf() - day1.valueOf();

    if (tTo.getMonth() == tFrom.getMonth()) {
      // From and to are in the same month
      return dt - dtFrom;
    } else {
      // To is in different month
      if (dt > dtFrom) {
        return dt - dtFrom;
      } else {
        return this._data.to - this._data.from - (dtTo - dt);
      }
    }
  }
};

dat.ProductServiceTimeslot = ProductServiceTimeslot;
}(window.dat = window.dat || {}));
