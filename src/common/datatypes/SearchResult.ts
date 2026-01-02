export class SearchResult {
  #items: unknown[];

  constructor(items: unknown[]) {
    this.#items = items;
  }

  size(): number {
    return this.#items.length;
  }

  getItems(): unknown[] {
    return this.#items;
  }
}

