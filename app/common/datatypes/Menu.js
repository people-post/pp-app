(function(dat) {
class Menu extends dat.MenuItem {
  constructor(data) { super(data, null); }

  getTheme() { return null; }

  _getPathItem() { return null; }
  _createSubItem(data) { return new dat.MenuEntryItem(data, this); }
};

dat.Menu = Menu;
}(window.dat = window.dat || {}));
