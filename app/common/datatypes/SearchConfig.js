export class SearchConfig {
  #categories = [];
  #sectors = [];
  #userIds = [];
  #tagIds = [];

  setCategories(categories) { this.#categories = categories; }
  setSectors(sectors) { this.#sectors = sectors; }
  setUserIds(ids) { this.#userIds = ids; }
  setTagIds(ids) { this.#tagIds = ids; }

  toJsonString() {
    let d = {
      categories : this.#categories,
      sectors : this.#sectors,
      user_ids : this.#userIds,
      tag_ids : this.#tagIds
    };
    return JSON.stringify(d);
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.SearchConfig = SearchConfig;
}
