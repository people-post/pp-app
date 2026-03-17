import { DirItem } from './DirItem.js';
import { ColorTheme } from './ColorTheme.js';
import type { MenuItemData } from '../../types/backend2.js';

export class MenuItem extends DirItem<MenuItemData, MenuItem> {
  #parentItem: MenuItem | null;

  constructor(data: MenuItemData, parentItem: MenuItem | null) {
    super(data, parentItem);
    this.#parentItem = parentItem;
  }

  getTagId(): string | null {
    return this._data.tag_id as string | null;
  }

  getTagIds(): string[] {
    const ids: string[] = this._data.tag_id ? [this._data.tag_id as string] : [];
    if (this.#parentItem) {
      return ids.concat(this.#parentItem.getTagIds());
    }
    return ids;
  }

  getTheme(): ColorTheme | null {
    return this.#parentItem ? this.#parentItem.getTheme() : null;
  }

  protected _getPathItem(): string | null {
    return this.getTagId() ?? null;
  }

  protected _createSubItem(data: MenuItemData): MenuItem {
    return new MenuItem(data, this);
  }
}