(function(gui) {
class MenuConfig extends gui.DirFragment {
  constructor() {
    super();
    let f = new gui.FSmartInput();
    f.setHintText("+New tag name");
    f.setDelegate(this);

    this.setNewItemFragment(f);
    this.setNMaxItems(C.MAX.N_MENU_ITEMS);

    this._fSelected = null;
    this._sectorId = null;
  }

  setSectorId(sectorId) { this._sectorId = sectorId; }

  onEntryItemRequestDelete(fEntryItem, itemId) {
    this.#onDeleteMenuItem(itemId);
  }
  onSimpleButtonClicked(fBtn) { this.#onDeleteMenuItem(fBtn.getValue()); }

  onFoldableItemOpen(fItem, itemId) {
    if (this._fSelected) {
      this._fSelected.close();
    }
    this._fSelected = fItem;
  }
  onFoldableItemClose(fItem, itemId) { this._fSelected = null; }

  onItemChosenInSmartInputFragment(fSmartInput, itemId) {
    let m = this.#getMenuItem();
    dba.Menus.asyncAddMenuItem(this._sectorId, m ? m.getId() : "", itemId);
  }

  onGuiMenuEntryItemConfigRequestChangeTheme(fDetail, menuId, key, color) {
    if (ext.Utilities.isValidColor(color)) {
      dba.Menus.asyncUpdateEntryMenuItemTheme(this._sectorId, menuId, key,
                                              color);
    }
  }

  onMenuItemRequestAddSubItem(fMenuItem, menuItemId, tagId) {
    dba.Menus.asyncAddMenuItem(this._sectorId, menuItemId, tagId);
  }

  getFilteredItemsForSmartInputFragment(fSmartInput, filterStr) {
    let s = filterStr.toLowerCase();
    let items = [];
    let tagIdsInUse = [];
    for (let i of this._getSubItems()) {
      tagIdsInUse.push(i.getTagId());
    }
    for (let t of dba.WebConfig.getTags()) {
      if (tagIdsInUse.indexOf(t.getId()) > -1) {
        continue;
      }
      if (t.getName().toLowerCase().indexOf(s) > -1) {
        items.push({id : t.getId(), name : t.getName()});
      }
    }
    return items;
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case fwk.T_DATA.WEB_CONFIG:
    case plt.T_DATA.USER_PROFILE:
    case plt.T_DATA.MENUS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _createSubDirFragment(item) {
    let itemId = item.getId();
    let f = new gui.FoldableItemFragment();
    f.setItemId(itemId);
    f.setHeaderFragment(new gui.MenuEntryItemName(itemId));
    let fContent = new gui.MenuEntryItemConfig(itemId);
    fContent.setDelegate(this);
    f.setContentFragment(fContent);

    let btn = new ui.Button();
    btn.setName("Delete...");
    btn.setThemeType(ui.Button.T_THEME.DANGER);
    btn.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    btn.setValue(itemId);
    btn.setDelegate(this);
    f.setActionFragment(btn);

    f.setDelegate(this);
    f.setIsOpen(this._fSelected && this._fSelected.getItemId() == item.getId());
    return f;
  }

  _getSubItems() {
    let m = this.#getMenuItem();
    return m ? m.getSubItems() : [];
  }

  #getMenuItem() { return this._dataSource.getMenuForGuiMenuConfig(this); }

  #onDeleteMenuItem(itemId) {
    this._confirmDangerousOperation(
        R.get("CONFIRM_DELETE_MENU_ITEM"),
        () => dba.Menus.asyncRemoveMenuItem(this._sectorId, itemId));
  }
};

gui.MenuConfig = MenuConfig;
}(window.gui = window.gui || {}));
