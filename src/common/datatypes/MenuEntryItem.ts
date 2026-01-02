import { MenuItem } from './MenuItem.js';
import { ColorTheme } from './ColorTheme.js';

interface MenuEntryItemData {
  theme?: { primary_color: string; secondary_color: string };
  [key: string]: unknown;
}

export class MenuEntryItem extends MenuItem {
  protected _data: MenuEntryItemData;

  constructor(data: MenuEntryItemData, parentItem: MenuItem | null) {
    super(data, parentItem);
    this._data = data;
  }

  getTheme(): ColorTheme | null {
    return this._data.theme ? new ColorTheme(this._data.theme) : null;
  }
}

