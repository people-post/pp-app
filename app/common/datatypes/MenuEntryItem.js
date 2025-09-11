(function(dat) {
class MenuEntryItem extends dat.MenuItem {
  getTheme() {
    return this._data.theme ? new dat.ColorTheme(this._data.theme) : null;
  }
};

dat.MenuEntryItem = MenuEntryItem;
}(window.dat = window.dat || {}));
