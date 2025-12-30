import { MenuItem } from './MenuItem.js';
import { ColorTheme } from './ColorTheme.js';

export class MenuEntryItem extends MenuItem {
  getTheme() {
    return this._data.theme ? new ColorTheme(this._data.theme) : null;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.MenuEntryItem = MenuEntryItem;
}
