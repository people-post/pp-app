import { MenuItem } from './MenuItem.js';
import { MenuEntryItem } from './MenuEntryItem.js';

interface MenuData {
  [key: string]: unknown;
}

export class Menu extends MenuItem {
  constructor(data: MenuData) {
    super(data, null);
  }

  getTheme(): null {
    return null;
  }

  protected _getPathItem(): string | undefined {
    return undefined;
  }

  protected _createSubItem(data: MenuData): MenuEntryItem {
    return new MenuEntryItem(data, this);
  }
}

