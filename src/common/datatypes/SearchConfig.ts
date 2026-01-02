export class SearchConfig {
  #categories: string[] = [];
  #sectors: string[] = [];
  #userIds: string[] = [];
  #tagIds: string[] = [];

  setCategories(categories: string[]): void {
    this.#categories = categories;
  }

  setSectors(sectors: string[]): void {
    this.#sectors = sectors;
  }

  setUserIds(ids: string[]): void {
    this.#userIds = ids;
  }

  setTagIds(ids: string[]): void {
    this.#tagIds = ids;
  }

  toJsonString(): string {
    const d = {
      categories: this.#categories,
      sectors: this.#sectors,
      user_ids: this.#userIds,
      tag_ids: this.#tagIds,
    };
    return JSON.stringify(d);
  }
}

