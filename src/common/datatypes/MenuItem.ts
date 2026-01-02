import { DirItem } from './DirItem.js';
import { ColorTheme } from './ColorTheme.js';

interface MenuItemData {
  tag_id?: string;
  [key: string]: unknown;
}

export class MenuItem extends DirItem {
  protected _data: MenuItemData;
  protected _parentItem: MenuItem | null;

  constructor(data: MenuItemData, parentItem: MenuItem | null) {
    super(data, parentItem);
    this._data = data;
    this._parentItem = parentItem;
  }

  getTagId(): string | undefined {
    return this._data.tag_id;
  }

  getTagIds(): string[] {
    const ids: string[] = this._data.tag_id ? [this._data.tag_id] : [];
    if (this._parentItem) {
      return ids.concat(this._parentItem.getTagIds());
    }
    return ids;
  }

  getTheme(): ColorTheme | null {
    return this._parentItem ? this._parentItem.getTheme() : null;
  }

  protected _getPathItem(): string | undefined {
    return this.getTagId();
  }

  protected _createSubItem(data: MenuItemData): MenuItem {
    return new MenuItem(data, this);
  }
}

