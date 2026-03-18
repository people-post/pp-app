import { ProductServiceTimeslot } from './ProductServiceTimeslot.js';
import type { ProductServiceLocationData, ProductServiceTimeslotData } from '../../types/backend2.js';

export class ProductServiceLocation {
  #data: ProductServiceLocationData | null = null;
  #timeslots: ProductServiceTimeslot[] = [];

  constructor(data: ProductServiceLocationData) {
    this.#data = data;
    if (data.time_slots) {
      for (const s of data.time_slots) {
        this.#timeslots.push(this.#initTimeslot(s));
      }
    }
  }

  getBranchId(): string | null {
    return this.#data?.branch_id ?? null;
  }

  getAssignee(): unknown {
    return this.#data?.assignee ?? null;
  }

  getTimeslots(): ProductServiceTimeslot[] {
    return this.#timeslots;
  }

  getTimeOverhead(): number {
    return this.#data?.time_overhead ?? 0;
  }

  getPriceOverhead(): number {
    return this.#data?.price_overhead ?? 0;
  }

  appendTimeslot(ts: ProductServiceTimeslot): void {
    this.#timeslots.push(ts);
  }

  setTimeOverhead(t: number): void {
    this.#data!.time_overhead = t;
  }

  setPriceOverhead(p: number): void {
    this.#data!.price_overhead = p;
  }

  setBranchId(id: string): void {
    this.#data!.branch_id = id;
  }

  estimateNAvailable(t: number): number {
    let n = 0;
    const overhead = this.#data?.time_overhead ?? 0;
    for (const ts of this.getTimeslots()) {
      n += ts.estimateNAvailable(t, overhead || 0);
    }
    return n;
  }

  toApiPostObj(): {
    time_slots: unknown[];
    time_overhead: number;
    branch_id: string | null;
    price_overhead: number;
  } {
    const tss: unknown[] = [];
    for (const ts of this.#timeslots) {
      tss.push(ts.toApiPostObj());
    }
    return {
      time_slots: tss,
      time_overhead: this.#data?.time_overhead ?? 0,
      branch_id: this.#data?.branch_id ?? null,
      price_overhead: this.#data?.price_overhead ?? 0,
    };
  }

  #initTimeslot(data: ProductServiceTimeslotData): ProductServiceTimeslot {
    return new ProductServiceTimeslot(data);
  }
}

