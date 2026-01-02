import { ServerDataObject } from './ServerDataObject.js';

export class BufferedList {
  private _items: ServerDataObject[] = [];

  constructor() {
    this._items = [];
  }

  getObjects(): ServerDataObject[] {
    return this._items;
  }

  getLatestObjectId(): string | number | null {
    if (this._items.length) {
      const id = this._items[this._items.length - 1].getId();
      return id ?? null;
    }
    return null;
  }

  extend(objects: ServerDataObject[]): ServerDataObject[] {
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
}

