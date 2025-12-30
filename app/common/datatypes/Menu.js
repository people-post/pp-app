import { MenuItem } from './MenuItem.js';
import { MenuEntryItem } from './MenuEntryItem.js';

export class Menu extends MenuItem {
  constructor(data) { super(data, null); }

  getTheme() { return null; }

  _getPathItem() { return null; }
  _createSubItem(data) { return new MenuEntryItem(data, this); }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Menu = Menu;
}
