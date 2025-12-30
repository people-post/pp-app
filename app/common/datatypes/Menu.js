export class Menu extends dat.MenuItem {
  constructor(data) { super(data, null); }

  getTheme() { return null; }

  _getPathItem() { return null; }
  _createSubItem(data) { return new dat.MenuEntryItem(data, this); }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Menu = Menu;
}
