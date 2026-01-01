import { DirFragment } from '../gui/DirFragment.js';
import { FSmartInput } from '../gui/FSmartInput.js';
import { FoldableItemFragment } from '../gui/FoldableItemFragment.js';
import { MenuEntryItemName } from './MenuEntryItemName.js';
import { MenuEntryItemConfig } from './MenuEntryItemConfig.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Menus } from '../dba/Menus.js';
import { WebConfig } from '../dba/WebConfig.js';
import Utilities from '../../lib/ext/Utilities.js';
import { T_DATA } from '../../lib/framework/Events.js';
import { MAX } from '../constants/Constants.js';

export class MenuConfig extends DirFragment {
  constructor() {
    super();
    let f = new FSmartInput();
    f.setHintText("+New tag name");
    f.setDelegate(this);

    this.setNewItemFragment(f);
    this.setNMaxItems(MAX.N_MENU_ITEMS);

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
    Menus.asyncAddMenuItem(this._sectorId, m ? m.getId() : "", itemId);
  }

  onGuiMenuEntryItemConfigRequestChangeTheme(fDetail, menuId, key, color) {
    if (Utilities.isValidColor(color)) {
      Menus.asyncUpdateEntryMenuItemTheme(this._sectorId, menuId, key,
                                              color);
    }
  }

  onMenuItemRequestAddSubItem(fMenuItem, menuItemId, tagId) {
    Menus.asyncAddMenuItem(this._sectorId, menuItemId, tagId);
  }

  getFilteredItemsForSmartInputFragment(fSmartInput, filterStr) {
    let s = filterStr.toLowerCase();
    let items = [];
    let tagIdsInUse = [];
    for (let i of this._getSubItems()) {
      tagIdsInUse.push(i.getTagId());
    }
    for (let t of WebConfig.getTags()) {
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
    case T_DATA.WEB_CONFIG:
    case T_DATA.USER_PROFILE:
    case T_DATA.MENUS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _createSubDirFragment(item) {
    let itemId = item.getId();
    let f = new FoldableItemFragment();
    f.setItemId(itemId);
    f.setHeaderFragment(new MenuEntryItemName(itemId));
    let fContent = new MenuEntryItemConfig(itemId);
    fContent.setDelegate(this);
    f.setContentFragment(fContent);

    let btn = new Button();
    btn.setName("Delete...");
    btn.setThemeType(Button.T_THEME.DANGER);
    btn.setLayoutType(Button.LAYOUT_TYPE.SMALL);
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
        () => Menus.asyncRemoveMenuItem(this._sectorId, itemId));
  }
};

