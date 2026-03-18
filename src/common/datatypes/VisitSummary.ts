import type { VisitSummaryData } from '../../types/backend2.js';

export class VisitSummary {
  #data: VisitSummaryData;

  constructor(data: VisitSummaryData) {
    this.#data = data;
  }

  getSubQueryKey(): string | null {
    return this.#data.sub_query_key;
  }

  getSubQueryValue(): string | null {
    return this.#data.sub_query_value;
  }

  getName(): string | null {
    return this.#data.name;
  }

  getTotal(): number {
    return this.#data.total || 0;
  }
}

