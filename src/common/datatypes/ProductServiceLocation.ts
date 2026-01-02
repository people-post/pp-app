import { ServerDataObject } from './ServerDataObject.js';
import { ProductServiceTimeslot } from './ProductServiceTimeslot.js';

interface ProductServiceLocationData {
  branch_id?: string;
  assignee?: unknown;
  time_overhead?: number;
  price_overhead?: number;
  time_slots?: unknown[];
  [key: string]: unknown;
}

export class ProductServiceLocation extends ServerDataObject {
  #timeslots: ProductServiceTimeslot[] = [];
  protected _data: ProductServiceLocationData;

  constructor(data: ProductServiceLocationData) {
    super(data);
    this._data = data;
    if (data.time_slots) {
      for (const s of data.time_slots) {
        this.#timeslots.push(this.#initTimeslot(s as Record<string, unknown>));
      }
    }
  }

  getBranchId(): string | undefined {
    return this._data.branch_id as string | undefined;
  }

  getAssignee(): unknown {
    return this._data.assignee;
  }

  getTimeslots(): ProductServiceTimeslot[] {
    return this.#timeslots;
  }

  getTimeOverhead(): number | undefined {
    return this._data.time_overhead as number | undefined;
  }

  getPriceOverhead(): number | undefined {
    return this._data.price_overhead as number | undefined;
  }

  appendTimeslot(ts: ProductServiceTimeslot): void {
    this.#timeslots.push(ts);
  }

  setTimeOverhead(t: number): void {
    this._data.time_overhead = t;
  }

  setPriceOverhead(p: number): void {
    this._data.price_overhead = p;
  }

  setBranchId(id: string): void {
    this._data.branch_id = id;
  }

  estimateNAvailable(t: number): number {
    let n = 0;
    const overhead = this._data.time_overhead as number | undefined;
    for (const ts of this.getTimeslots()) {
      n += ts.estimateNAvailable(t, overhead || 0);
    }
    return n;
  }

  toApiPostObj(): {
    time_slots: unknown[];
    time_overhead: number | undefined;
    branch_id: string | undefined;
    price_overhead: number | undefined;
  } {
    const tss: unknown[] = [];
    for (const ts of this.#timeslots) {
      tss.push(ts.toApiPostObj());
    }
    return {
      time_slots: tss,
      time_overhead: this._data.time_overhead as number | undefined,
      branch_id: this._data.branch_id as string | undefined,
      price_overhead: this._data.price_overhead as number | undefined,
    };
  }

  #initTimeslot(data: Record<string, unknown>): ProductServiceTimeslot {
    return new ProductServiceTimeslot(data);
  }
}

