export class MenuEntryItem extends dat.MenuItem {
  getTheme() {
    return this._data.theme ? new dat.ColorTheme(this._data.theme) : null;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.MenuEntryItem = MenuEntryItem;
}
