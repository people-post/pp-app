import { TreeNode } from './TreeNode.js';
import { ColorTheme } from './ColorTheme.js';
import type { MenuItemData } from '../../types/backend2.js';

export class MenuItem extends TreeNode<MenuItemData, MenuItem> {
  constructor(data: MenuItemData, parentItem: MenuItem | null = null) {
    super(data, parentItem);
    if (data.created_at) {
      data._created_at = new Date(data.created_at * 1000);
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

  getSubItems(): MenuItem[] {
    return this.getChildren();
  }

  getSubItem(id: string): MenuItem | null {
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

  getTagId(): string | null {
    return this._data.tag_id as string | null;
  }

  getTagIds(): string[] {
    const ids: string[] = this._data.tag_id ? [this._data.tag_id as string] : [];
    const parent = this.getParent();
    if (parent) {
      return ids.concat(parent.getTagIds());
    }
    return ids;
  }

  getTheme(): ColorTheme | null {
    const parent = this.getParent();
    return parent ? parent.getTheme() : null;
  }

  find(id: string): MenuItem | null {
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
    return this.getTagId() ?? null;
  }

  protected _createSubItem(data: MenuItemData): MenuItem {
    return new MenuItem(data, this);
  }

  #initSubItems(items: MenuItemData['sub_items'] | undefined): MenuItem[] {
    const subItems: MenuItem[] = [];
    if (items) {
      for (const i of items) {
        subItems.push(this._createSubItem(i));
      }
    }
    return subItems;
  }
}