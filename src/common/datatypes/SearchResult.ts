import type { SearchResultData } from '../../types/backend2.js';

export class SearchResult {
  #items: SearchResultData[];

  constructor(items: SearchResultData[]) {
    this.#items = items;
  }

  size(): number {
    return this.#items.length;
  }

  getItems(): SearchResultData[] {
    return this.#items;
  }
}

