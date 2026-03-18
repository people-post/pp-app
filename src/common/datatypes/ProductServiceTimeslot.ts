import type { ProductServiceTimeslotData } from '../../types/backend2.js';

export class ProductServiceTimeslot {
  // All time values are timestamp in seconds
  static readonly T_REP = {
    ONCE: 'ONCE',
    DAY: 'DAY',
    DAY2: 'DAY2',
    WEEK: 'WEEK',
    WEEK2: 'WEEK2',
    MONTH: 'MONTH',
  } as const;

  #data: ProductServiceTimeslotData | null = null;

  constructor(data: ProductServiceTimeslotData) {
    this.#data = data;
  }

  isAfter(t: number): boolean {
    if (this.#data?.repetition == ProductServiceTimeslot.T_REP.ONCE) {
      return t < (this.#data?.to ?? 0);
    } else {
      // Currently no end date, so ok.
      return true;
    }
  }

  getFromTime(): number | null {
    return this.#data?.from ?? null;
  }

  getToTime(): number | null {
    return this.#data?.to ?? null;
  }

  getTotal(): number | null {
    return this.#data?.n ?? null;
  }

  getRepetition(): string | null {
    return this.#data?.repetition ?? null;
  }

  setFromTime(t: number): void {
    this.#data!.from = t;
  }

  setToTime(t: number): void {
    this.#data!.to = t;
  }

  setTotal(n: number): void {
    this.#data!.n = n;
  }

  setRepetition(r: string): void {
    this.#data!.repetition = r;
  }

  toApiPostObj(): {
    from: number | null;
    to: number | null;
    n: number | null;
    rep: string | null;
  } {
    return {
      from: this.#data?.from ?? null,
      to: this.#data?.to ?? null,
      n: this.#data?.n ?? null,
      rep: this.#data?.repetition ?? null,
    };
  }

  estimateNAvailable(t: number, tOverhead: number): number {
    const dt = this.#getNearestTimeOffset(t);
    if (dt < 0) {
      return 0;
    }
    const from = this.#data?.from ?? 0;
    const to = this.#data?.to ?? 0;
    let tTotal = to - from;
    if (tTotal <= 0) {
      return 0;
    }
    let dtRemaining = tTotal - dt;
    if (dtRemaining < tOverhead) {
      return 0;
    }
    const n = this.#data?.n ?? 0;
    return Math.floor((dtRemaining / tTotal) * n);
  }

  contains(t: number): boolean {
    const dt = this.#getNearestTimeOffset(t);
    const from = this.#data?.from ?? 0;
    const to = this.#data?.to ?? 0;
    return dt > 0 && dt < to - from;
  }

  #getNearestTimeOffset(t: number): number {
    const from = this.#data?.from ?? 0;
    if (t < from) {
      return t - from;
    }
    // Currently no end date, so no end date check
    let dt = 0;
    const repetition = this.#data?.repetition ?? null;
    switch (repetition) {
      case ProductServiceTimeslot.T_REP.DAY:
        dt = 3600 * 24;
        break;
      case ProductServiceTimeslot.T_REP.DAY2:
        dt = 3600 * 24 * 2;
        break;
      case ProductServiceTimeslot.T_REP.WEEK:
        dt = 3600 * 24 * 7;
        break;
      case ProductServiceTimeslot.T_REP.WEEK2:
        dt = 3600 * 24 * 7 * 2;
        break;
      case ProductServiceTimeslot.T_REP.MONTH:
        return this.#monthlyGetNearestTimeOffset(t);
      default:
        break;
    }
    if (dt > 0) {
      return (t - from) % dt;
    } else {
      return t - from;
    }
  }

  #monthlyGetNearestTimeOffset(t: number): number {
    const from = this.#data?.from ?? 0;
    const to = this.#data?.to ?? 0;
    const tFrom = new Date(from * 1000);
    const tTo = new Date(to * 1000);
    const tt = new Date(t * 1000);

    // Normalize to the distance to the first day of month
    let day1 = new Date(tFrom.getFullYear(), tFrom.getMonth());
    const dtFrom = tFrom.valueOf() - day1.valueOf();

    day1 = new Date(tTo.getFullYear(), tTo.getMonth());
    const dtTo = tTo.valueOf() - day1.valueOf();

    day1 = new Date(tt.getFullYear(), tt.getMonth());
    const dt = tt.valueOf() - day1.valueOf();

    if (tTo.getMonth() == tFrom.getMonth()) {
      // From and to are in the same month
      return dt - dtFrom;
    } else {
      // To is in different month
      if (dt > dtFrom) {
        return dt - dtFrom;
      } else {
        return to - from - (dtTo - dt);
      }
    }
  }
}
