import type { DirItemData } from '../../types/backend2.js';
import { TreeNode } from './TreeNode.js';

export class DirItem<
  TData extends DirItemData<TData> = DirItemData<any>,
  TSubItem extends DirItem<TData, TSubItem> = any,
> extends TreeNode<TData, TSubItem> {
  constructor(data: TData, parentItem: TSubItem | null = null) {
    super(data, parentItem);
    if (data.created_at) {
      data.created_at = new Date((data.created_at as number) * 1000);
    }
    this._setChildren(this.#initSubItems(data.sub_items));
  }

  isDir(): boolean {
    return true;
  }

  isEmpty(): boolean {
    return this.getChildren().length === 0;
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
    return this.getChildren();
  }

  getSubItem(id: string): TSubItem | null {
    for (const i of this.getChildren()) {
      if (i.getId() === id) {
        return i;
      }
    }
    return null;
  }

  getPath(): (string | undefined)[] {
    const p = this._getPathItem();
    const items: (string | undefined)[] = p ? [p] : [];
    const parent = this.getParent();
    if (parent) {
      return parent.getPath().concat(items);
    }
    return items;
  }

  find(id: string): TSubItem | null {
    for (const i of this.getChildren()) {
      if (i.getId() === id) {
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
