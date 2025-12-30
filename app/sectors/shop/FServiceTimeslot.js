
export class FServiceTimeslot extends ui.Fragment {
  constructor() {
    super();
    this._data = null;
  }

  setData(d) { this._data = d; }

  _renderOnRender(render) {
    render.setClassName("small-info-text");
    let s = `__FROM__ - __TO__ __REP__(__N__)`;
    let r = this._data.getRepetition();
    let tFrom = this._data.getFromTime();
    let tTo = this._data.getToTime();
    s = s.replace("__FROM__", this.#renderTime(r, tFrom));
    s = s.replace("__TO__", this.#renderTime(r, tTo));
    s = s.replace("__N__", this._data.getTotal());
    s = s.replace("__REP__", this.#renderRepetitionName(r, tFrom));
    render.replaceContent(s);
  }

  #renderRepetitionName(r, t) {
    let sRep = "";
    switch (r) {
    case dat.ProductServiceTimeslot.T_REP.DAY:
      sRep = "daily";
      break;
    case dat.ProductServiceTimeslot.T_REP.DAY2:
      sRep = "every other day";
      break;
    case dat.ProductServiceTimeslot.T_REP.WEEK:
      sRep = ext.Utilities.timestampToWeekdayString(t) + " weekly";
      break;
    case dat.ProductServiceTimeslot.T_REP.WEEK2:
      sRep = ext.Utilities.timestampToWeekdayString(t) + " every other week";
      break;
    case dat.ProductServiceTimeslot.T_REP.MONTH:
      sRep = "monthly";
      break;
    default:
      break;
    }
    if (r == dat.ProductServiceTimeslot.T_REP.ONCE) {
      return sRep;
    } else {
      return sRep + " from " + ext.Utilities.timestampToDateString(t);
    }
  }

  #renderTime(rep, t) {
    if (rep == dat.ProductServiceTimeslot.T_REP.ONCE) {
      return ext.Utilities.timestampToDateTimeString(t);
    } else {
      return ext.Utilities.timestampToTimeString(t);
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FServiceTimeslot = FServiceTimeslot;
}
