import { MenuItem } from './MenuItem.js';
import { MenuEntryItem } from './MenuEntryItem.js';
import type { MenuData, MenuEntryItemData, MenuItemData } from '../../types/backend2.js';

export class Menu extends MenuItem {
  constructor(data: MenuData) {
    super(data, null);
  }

  getTheme(): null {
    return null;
  }

  protected _getPathItem(): string | null {
    return null;
  }

  protected _createSubItem(data: MenuItemData): MenuEntryItem {
    return new MenuEntryItem(data as MenuEntryItemData, this);
  }
}

