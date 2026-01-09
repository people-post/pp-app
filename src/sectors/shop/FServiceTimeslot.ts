import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ProductServiceTimeslot } from '../../common/datatypes/ProductServiceTimeslot.js';
import ExtUtilities from '../../lib/ext/Utilities.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FServiceTimeslot extends Fragment {
  protected _data: ProductServiceTimeslot | null = null;

  constructor() {
    super();
  }

  setData(d: ProductServiceTimeslot): void { this._data = d; }

  _renderOnRender(render: Render): void {
    if (!this._data) return;
    render.setClassName("small-info-text");
    let s = `__FROM__ - __TO__ __REP__(__N__)`;
    let r = this._data.getRepetition();
    let tFrom = this._data.getFromTime();
    let tTo = this._data.getToTime();
    s = s.replace("__FROM__", this.#renderTime(r, tFrom));
    s = s.replace("__TO__", this.#renderTime(r, tTo));
    s = s.replace("__N__", String(this._data.getTotal()));
    s = s.replace("__REP__", this.#renderRepetitionName(r, tFrom));
    render.replaceContent(s);
  }

  #renderRepetitionName(r: symbol, t: number): string {
    let sRep = "";
    switch (r) {
    case ProductServiceTimeslot.T_REP.DAY:
      sRep = "daily";
      break;
    case ProductServiceTimeslot.T_REP.DAY2:
      sRep = "every other day";
      break;
    case ProductServiceTimeslot.T_REP.WEEK:
      sRep = ExtUtilities.timestampToWeekdayString(t) + " weekly";
      break;
    case ProductServiceTimeslot.T_REP.WEEK2:
      sRep = ExtUtilities.timestampToWeekdayString(t) + " every other week";
      break;
    case ProductServiceTimeslot.T_REP.MONTH:
      sRep = "monthly";
      break;
    default:
      break;
    }
    if (r == ProductServiceTimeslot.T_REP.ONCE) {
      return sRep;
    } else {
      return sRep + " from " + ExtUtilities.timestampToDateString(t);
    }
  }

  #renderTime(rep: symbol, t: number): string {
    if (rep == ProductServiceTimeslot.T_REP.ONCE) {
      return ExtUtilities.timestampToDateTimeString(t);
    } else {
      return ExtUtilities.timestampToTimeString(t);
    }
  }
}
