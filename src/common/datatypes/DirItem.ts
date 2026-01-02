import { ServerDataObject } from './ServerDataObject.js';

interface DirItemData {
  name?: string;
  sub_items?: unknown[];
  id?: string;
  [key: string]: unknown;
}

export class DirItem extends ServerDataObject {
  #subItems: DirItem[] = [];
  #parentItem: DirItem | null = null;
  protected _data: DirItemData;

  constructor(data: DirItemData, parentItem: DirItem | null = null) {
    super(data);
    this._data = data;
    this.#subItems = this.#initSubItems(data.sub_items);
    this.#parentItem = parentItem;
  }

  isDir(): boolean {
    return true;
  }

  isEmpty(): boolean {
    return this.#subItems.length == 0;
  }

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getSubItems(): DirItem[] {
    return this.#subItems;
  }

  getSubItem(id: string): DirItem | null {
    for (const i of this.#subItems) {
      if (i.getId() == id) {
        return i;
      }
    }
    return null;
  }

  getPath(): (string | undefined)[] {
    const p = this._getPathItem();
    const items: (string | undefined)[] = p ? [p] : [];
    if (this.#parentItem) {
      return this.#parentItem.getPath().concat(items);
    }
    return items;
  }

  getParent(): DirItem | null {
    return this.#parentItem;
  }

  getDepth(): number {
    if (this.#parentItem) {
      return this.#parentItem.getDepth() + 1;
    } else {
      return 0;
    }
  }

  find(id: string): DirItem | null {
    for (const i of this.#subItems) {
      if (i.getId() == id) {
        return i;
      }
      const ii = i.find(id);
      if (ii) {
        return ii;
      }
    }
    return null;
  }

  protected _getPathItem(): string | undefined {
    return this.getName();
  }

  protected _createSubItem(data: DirItemData): DirItem {
    return new DirItem(data, this);
  }

  #initSubItems(items: unknown[] | undefined): DirItem[] {
    const subItems: DirItem[] = [];
    if (items) {
      for (const i of items) {
        subItems.push(this._createSubItem(i as DirItemData));
      }
    }
    return subItems;
  }
}
