interface BufferedListItem {
  getId(): string | null;
  getCreationTime(): Date | undefined;
}

export class BufferedList<T extends BufferedListItem> {
  private _items: T[] = [];

  constructor() {
    this._items = [];
  }

  clear(): void {
    this._items = [];
  }

  getObjects(): T[] {
    return this._items;
  }

  getOldestObjectId(): string | null {
    if (this._items.length) {
      const id = this._items[0].getId();
      return id ?? null;
    }
    return null;
  }

  getLatestObjectId(): string | null {
    if (this._items.length) {
      const id = this._items[this._items.length - 1].getId();
      return id ?? null;
    }
    return null;
  }

  extend(objects: T[]): T[] {
    if (objects.length) {
      objects.sort((a, b) => {
        const aTime = a.getCreationTime();
        const bTime = b.getCreationTime();
        if (!aTime || !bTime) return 0;
        return aTime > bTime ? 1 : -1;
      });
      const lastId = this.getLatestObjectId();
      if (objects[0].getId() === lastId) {
        objects.shift();
      }
    }
    for (const obj of objects) {
      this._items.push(obj);
    }
    return objects;
  }

  /** Merge older messages before the current buffer (dedupe by id). */
  prependOlder(objects: T[]): T[] {
    if (!objects.length) {
      return [];
    }
    objects.sort((a, b) => {
      const aTime = a.getCreationTime();
      const bTime = b.getCreationTime();
      if (!aTime || !bTime) {
        return 0;
      }
      return aTime < bTime ? -1 : 1;
    });
    const existingIds = new Set<string>();
    for (const item of this._items) {
      const id = item.getId();
      if (id) {
        existingIds.add(id);
      }
    }
    const prepended: T[] = [];
    const firstExistingId = this._items.length ? this._items[0].getId() : null;
    for (const obj of objects) {
      const oid = obj.getId();
      if (oid && (existingIds.has(oid) || oid === firstExistingId)) {
        continue;
      }
      if (oid) {
        existingIds.add(oid);
      }
      prepended.push(obj);
    }
    this._items = [ ...prepended, ...this._items ];
    return prepended;
  }
}

