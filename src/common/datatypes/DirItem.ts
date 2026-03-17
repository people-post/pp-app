import type { DirItemData } from '../../types/backend2.js';

export class DirItem<
  TData extends DirItemData<TData> = DirItemData<any>,
  TSubItem extends DirItem<TData, TSubItem> = any,
> {
  #subItems: TSubItem[] = [];
  #parentItem: TSubItem | null = null;
  protected _data: TData;

  constructor(data: TData, parentItem: TSubItem | null = null) {
    if (data.created_at) {
      data.created_at = new Date((data.created_at as number) * 1000);
    }
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

  getId(): string {
    return this._data.id;
  }

  getCreationTime(): Date | undefined {
    return this._data.created_at as Date | undefined;
  }

  getName(): string | null {
    return this._data.name ?? null;
  }

  getSubItems(): TSubItem[] {
    return this.#subItems;
  }

  getSubItem(id: string): TSubItem | null {
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

  getParent(): TSubItem | null {
    return this.#parentItem;
  }

  getDepth(): number {
    if (this.#parentItem) {
      return this.#parentItem.getDepth() + 1;
    } else {
      return 0;
    }
  }

  find(id: string): TSubItem | null {
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

  protected _getPathItem(): string | null {
    return this.getName() ?? null;
  }

  protected _createSubItem(data: TData): TSubItem {
    return new DirItem(
      data,
      this as unknown as DirItem<TData, TSubItem>,
    ) as unknown as TSubItem;
  }

  #initSubItems(items: TData['sub_items'] | undefined): TSubItem[] {
    const subItems: TSubItem[] = [];
    if (items) {
      for (const i of items) {
        subItems.push(this._createSubItem(i as TData));
      }
    }
    return subItems;
  }
}
