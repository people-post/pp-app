import { MenuItem } from './MenuItem.js';
import { ColorTheme } from './ColorTheme.js';
import type { MenuEntryItemData } from '../../types/backend2.js';

export class MenuEntryItem extends MenuItem {
  constructor(data: MenuEntryItemData, parentItem: MenuItem | null) {
    super(data, parentItem);
  }

  getTheme(): ColorTheme | null {
    const theme = (this._data as MenuEntryItemData).theme;
    if (theme) {
      return new ColorTheme(theme);
    }
    return super.getTheme();
  }
}

